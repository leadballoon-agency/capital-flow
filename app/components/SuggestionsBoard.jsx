'use client';

import { useEffect, useState } from 'react';

const CATEGORIES = [
  { value: 'indicator', icon: '📊', label: 'Indicator' },
  { value: 'alert', icon: '🔔', label: 'Alerts' },
  { value: 'website', icon: '🌐', label: 'Website' },
  { value: 'signal_type', icon: '📈', label: 'Signal Type' },
  { value: 'bug', icon: '🐛', label: 'Bug' },
  { value: 'other', icon: '💡', label: 'Other' },
];

// Status labels
const statusLabels = {
  in_progress: 'In Progress',
  planned: 'Planned',
  under_review: 'Under Review',
  completed: 'Completed',
};

// Category icons
const categoryIcons = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.icon]));

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">💡</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/**
 * Replaces, in the old suggest.html, the whole <div class="content-grid"> block
 * (suggestion form card + community roadmap list).
 */
export default function SuggestionsBoard() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // listStatus: 'loading' | 'ready' | 'error'
  const [listStatus, setListStatus] = useState('loading');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchSuggestions() {
      try {
        const response = await fetch('/api/suggestions');
        const data = await response.json();
        if (cancelled) return;
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
        setListStatus('ready');
      } catch (error) {
        console.log('Error fetching suggestions:', error);
        if (!cancelled) setListStatus('error');
      }
    }
    fetchSuggestions();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, description, email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  let listContent;
  if (listStatus === 'loading') {
    listContent = <EmptyState title="Loading suggestions..." text="Fetching the community roadmap" />;
  } else if (listStatus === 'error') {
    listContent = <EmptyState title="Roadmap Coming Soon" text="Be the first to submit a suggestion!" />;
  } else if (suggestions.length === 0) {
    listContent = (
      <EmptyState
        title="Be the First!"
        text="No public suggestions yet. Submit yours and help shape the roadmap."
      />
    );
  } else {
    listContent = suggestions.map((s, i) => (
      <div className="suggestion-card" key={s.id ?? i}>
        <div className="suggestion-header">
          <div className="suggestion-title">{s.title}</div>
          <span className={`suggestion-status ${s.status}`}>{statusLabels[s.status] || s.status}</span>
        </div>
        {s.description ? (
          <div className="suggestion-description">
            {s.description.substring(0, 150)}
            {s.description.length > 150 ? '...' : ''}
          </div>
        ) : null}
        <div className="suggestion-meta">
          <span className="suggestion-category">
            {categoryIcons[s.category] || '💡'} {s.category}
          </span>
          <span className="suggestion-votes">👍 {s.votes}</span>
        </div>
      </div>
    ));
  }

  return (
    <div className="content-grid">
      {/* Suggestion Form */}
      <div className="form-card">
        <div className="form-header">
          <h2>Submit a Suggestion</h2>
          <p>All ideas welcome - big or small</p>
        </div>

        <form
          id="suggestion-form"
          onSubmit={handleSubmit}
          style={submitted ? { display: 'none' } : undefined}
        >
          <div className="form-group">
            <label className="form-label">
              Category <span className="required">*</span>
            </label>
            <div className="category-pills">
              {CATEGORIES.map((c, i) => (
                <label
                  key={c.value}
                  className={`category-pill${category === c.value ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={category === c.value}
                    onChange={() => setCategory(c.value)}
                    required={i === 0}
                  />
                  <span className="category-icon">{c.icon}</span>
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="text-input"
              placeholder="Brief summary of your idea"
              maxLength={200}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="char-count">
              <span id="title-count">{title.length}</span>/200
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="text-input"
              placeholder="Explain your suggestion in more detail. What problem does it solve? How would it work?"
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="char-count">
              <span id="desc-count">{description.length}</span>/2000
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="text-input"
              placeholder="Get notified when your suggestion is reviewed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" id="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </form>

        <div className={`success-message${submitted ? ' show' : ''}`} id="success-message">
          <div className="success-icon">✓</div>
          <h3>Thanks for your input!</h3>
          <p>Your suggestion has been submitted and will be reviewed soon.</p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="suggestions-section">
        <h2>📋 Community Roadmap</h2>
        <div className="suggestions-list" id="suggestions-list">
          {listContent}
        </div>
      </div>
    </div>
  );
}
