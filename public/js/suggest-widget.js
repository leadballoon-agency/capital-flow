/**
 * Capital Flow Suggestion Widget
 * A floating feedback button that expands into a sleek suggestion form
 *
 * Usage: Add <script src="/js/suggest-widget.js"></script> to any page
 */

(function() {
  // Only load once
  if (window.CFSuggestWidget) return;
  window.CFSuggestWidget = true;

  // Inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    /* Suggestion Widget */
    .cf-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #ff6b00, #ff8533);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(255, 107, 0, 0.4);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cf-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(255, 107, 0, 0.5);
    }

    .cf-widget-btn svg {
      width: 24px;
      height: 24px;
      fill: white;
      transition: transform 0.3s;
    }

    .cf-widget-btn.open svg {
      transform: rotate(45deg);
    }

    /* Widget Panel */
    .cf-widget-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 340px;
      max-height: 480px;
      background: #111111;
      border: 1px solid #1a1a1a;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .cf-widget-panel.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    /* Panel Header */
    .cf-widget-header {
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, rgba(255, 107, 0, 0.1), transparent);
      border-bottom: 1px solid #1a1a1a;
    }

    .cf-widget-header h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.25rem 0;
    }

    .cf-widget-header p {
      font-size: 0.8125rem;
      color: #888;
      margin: 0;
    }

    /* Panel Content */
    .cf-widget-content {
      padding: 1.25rem 1.5rem;
      max-height: 360px;
      overflow-y: auto;
    }

    .cf-widget-content::-webkit-scrollbar {
      width: 4px;
    }

    .cf-widget-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .cf-widget-content::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 2px;
    }

    /* Category Chips */
    .cf-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .cf-category {
      padding: 0.375rem 0.75rem;
      background: #0a0a0a;
      border: 1px solid #1a1a1a;
      border-radius: 50px;
      font-size: 0.75rem;
      color: #aaa;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .cf-category:hover {
      border-color: #333;
      color: #fff;
    }

    .cf-category.selected {
      background: #ff6b00;
      border-color: #ff6b00;
      color: #fff;
    }

    /* Input Fields */
    .cf-field {
      margin-bottom: 1rem;
    }

    .cf-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #888;
      margin-bottom: 0.375rem;
    }

    .cf-input {
      width: 100%;
      padding: 0.625rem 0.875rem;
      background: #0a0a0a;
      border: 1px solid #1a1a1a;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #fff;
      font-family: inherit;
      transition: all 0.2s;
    }

    .cf-input:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);
    }

    .cf-input::placeholder {
      color: #555;
    }

    textarea.cf-input {
      min-height: 80px;
      resize: vertical;
    }

    /* Submit Button */
    .cf-submit {
      width: 100%;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #ff6b00, #ff8533);
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cf-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
    }

    .cf-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Success State */
    .cf-success {
      display: none;
      text-align: center;
      padding: 2rem 1rem;
    }

    .cf-success.show {
      display: block;
    }

    .cf-success-icon {
      width: 64px;
      height: 64px;
      background: rgba(0, 255, 136, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.5rem;
    }

    .cf-success h4 {
      font-size: 1rem;
      color: #00ff88;
      margin: 0 0 0.5rem 0;
    }

    .cf-success p {
      font-size: 0.8125rem;
      color: #888;
      margin: 0;
    }

    .cf-form.hidden {
      display: none;
    }

    /* Mobile */
    @media (max-width: 480px) {
      .cf-widget-panel {
        right: 12px;
        left: 12px;
        width: auto;
        bottom: 80px;
      }

      .cf-widget-btn {
        right: 16px;
        bottom: 16px;
      }
    }

    /* Tooltip */
    .cf-widget-btn::before {
      content: 'Suggest a feature';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 12px;
      padding: 0.5rem 0.75rem;
      background: #1a1a1a;
      border-radius: 6px;
      font-size: 0.75rem;
      color: #fff;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .cf-widget-btn:hover::before {
      opacity: 1;
      visibility: visible;
    }

    .cf-widget-btn.open::before {
      display: none;
    }
  `;
  document.head.appendChild(styles);

  // Create widget HTML
  const widget = document.createElement('div');
  widget.innerHTML = `
    <button class="cf-widget-btn" id="cf-widget-btn" aria-label="Suggest a feature">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </button>
    <div class="cf-widget-panel" id="cf-widget-panel">
      <div class="cf-widget-header">
        <h3>💡 Got an idea?</h3>
        <p>Help us make Capital Flow better</p>
      </div>
      <div class="cf-widget-content">
        <form class="cf-form" id="cf-form">
          <div class="cf-categories" id="cf-categories">
            <div class="cf-category" data-value="indicator">📊 Indicator</div>
            <div class="cf-category" data-value="alert">🔔 Alerts</div>
            <div class="cf-category" data-value="website">🌐 Website</div>
            <div class="cf-category" data-value="signal_type">📈 Signal</div>
            <div class="cf-category" data-value="bug">🐛 Bug</div>
            <div class="cf-category" data-value="other">💡 Other</div>
          </div>
          <div class="cf-field">
            <label class="cf-label">What's your idea?</label>
            <input type="text" class="cf-input" id="cf-title" placeholder="Brief summary..." maxlength="200" required>
          </div>
          <div class="cf-field">
            <label class="cf-label">Details (optional)</label>
            <textarea class="cf-input" id="cf-description" placeholder="Tell us more..." maxlength="2000"></textarea>
          </div>
          <button type="submit" class="cf-submit" id="cf-submit">Send Feedback</button>
        </form>
        <div class="cf-success" id="cf-success">
          <div class="cf-success-icon">✓</div>
          <h4>Thanks!</h4>
          <p>Your feedback helps us improve.</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // Widget logic
  const btn = document.getElementById('cf-widget-btn');
  const panel = document.getElementById('cf-widget-panel');
  const form = document.getElementById('cf-form');
  const success = document.getElementById('cf-success');
  const categories = document.querySelectorAll('.cf-category');
  let selectedCategory = null;

  // Toggle panel
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    panel.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      btn.classList.remove('open');
      panel.classList.remove('open');
    }
  });

  // Category selection
  categories.forEach(cat => {
    cat.addEventListener('click', () => {
      categories.forEach(c => c.classList.remove('selected'));
      cat.classList.add('selected');
      selectedCategory = cat.dataset.value;
    });
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const title = document.getElementById('cf-title').value;
    const description = document.getElementById('cf-description').value;
    const submitBtn = document.getElementById('cf-submit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          title: title,
          description: description
        })
      });

      if (response.ok) {
        form.classList.add('hidden');
        success.classList.add('show');

        // Reset after 3 seconds
        setTimeout(() => {
          btn.classList.remove('open');
          panel.classList.remove('open');

          setTimeout(() => {
            form.classList.remove('hidden');
            success.classList.remove('show');
            form.reset();
            categories.forEach(c => c.classList.remove('selected'));
            selectedCategory = null;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Feedback';
          }, 300);
        }, 2500);
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Feedback';
      }
    } catch (error) {
      alert('Network error. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Feedback';
    }
  });

  // Keyboard shortcut: Press 'F' to open (when not in input)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      btn.click();
    }
    if (e.key === 'Escape') {
      btn.classList.remove('open');
      panel.classList.remove('open');
    }
  });
})();
