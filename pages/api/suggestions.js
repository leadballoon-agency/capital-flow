// Suggestions API
// GET: Fetch approved suggestions for public display
// POST: Submit a new suggestion

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS suggestions (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      category VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      email VARCHAR(255),
      status VARCHAR(50) DEFAULT 'new',
      votes INT DEFAULT 0,
      admin_notes TEXT
    )
  `;

  // GET: Fetch public suggestions (not new, not won't do)
  if (req.method === 'GET') {
    try {
      const suggestions = await sql`
        SELECT
          id,
          created_at,
          category,
          title,
          description,
          status,
          votes
        FROM suggestions
        WHERE status NOT IN ('new', 'wont_do')
        ORDER BY
          CASE status
            WHEN 'in_progress' THEN 1
            WHEN 'planned' THEN 2
            WHEN 'under_review' THEN 3
            WHEN 'completed' THEN 4
          END,
          votes DESC,
          created_at DESC
        LIMIT 50
      `;

      return res.status(200).json({ suggestions });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST: Submit new suggestion
  if (req.method === 'POST') {
    try {
      const { category, title, description, email } = req.body;

      // Validation
      if (!category || !title) {
        return res.status(400).json({ error: 'Category and title are required' });
      }

      if (title.length > 200) {
        return res.status(400).json({ error: 'Title must be under 200 characters' });
      }

      if (description && description.length > 2000) {
        return res.status(400).json({ error: 'Description must be under 2000 characters' });
      }

      // Valid categories
      const validCategories = [
        'indicator',
        'alert',
        'website',
        'signal_type',
        'bug',
        'other'
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      // Insert suggestion
      const result = await sql`
        INSERT INTO suggestions (category, title, description, email)
        VALUES (${category}, ${title}, ${description || null}, ${email || null})
        RETURNING id
      `;

      return res.status(201).json({
        success: true,
        message: 'Suggestion submitted successfully',
        id: result[0].id
      });

    } catch (error) {
      console.error('Error submitting suggestion:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
