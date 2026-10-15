'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './suggest-widget.css';

const CATEGORIES = [
  { value: 'indicator', label: '📊 Indicator' },
  { value: 'alert', label: '🔔 Alerts' },
  { value: 'website', label: '🌐 Website' },
  { value: 'signal_type', label: '📈 Signal' },
  { value: 'bug', label: '🐛 Bug' },
  { value: 'other', label: '💡 Other' }
];

export default function SuggestWidget() {
  const widgetRef = useRef(null);
  const timersRef = useRef([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  // Clear any pending reset timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Keyboard shortcuts: 'f' toggles (when not in an input), Escape closes
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (e.key === 'f' && !['INPUT', 'TEXTAREA'].includes(tag)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') {
        close();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [toggle, close]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    setSubmitting(true);

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
        setSuccess(true);

        // Close after 2.5s, then reset the form once the panel has faded out
        timersRef.current.push(setTimeout(() => {
          setOpen(false);

          timersRef.current.push(setTimeout(() => {
            setSuccess(false);
            setTitle('');
            setDescription('');
            setSelectedCategory(null);
            setSubmitting(false);
          }, 300));
        }, 2500));
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong');
        setSubmitting(false);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div ref={widgetRef}>
      <button
        className={`cf-widget-btn${open ? ' open' : ''}`}
        id="cf-widget-btn"
        aria-label="Suggest a feature"
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
      <div className={`cf-widget-panel${open ? ' open' : ''}`} id="cf-widget-panel">
        <div className="cf-widget-header">
          <h3>💡 Got an idea?</h3>
          <p>Help us make Capital Flow better</p>
        </div>
        <div className="cf-widget-content">
          <form className={`cf-form${success ? ' hidden' : ''}`} id="cf-form" onSubmit={handleSubmit}>
            <div className="cf-categories" id="cf-categories">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.value}
                  className={`cf-category${selectedCategory === cat.value ? ' selected' : ''}`}
                  data-value={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </div>
              ))}
            </div>
            <div className="cf-field">
              <label className="cf-label">What&apos;s your idea?</label>
              <input
                type="text"
                className="cf-input"
                id="cf-title"
                placeholder="Brief summary..."
                maxLength={200}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="cf-field">
              <label className="cf-label">Details (optional)</label>
              <textarea
                className="cf-input"
                id="cf-description"
                placeholder="Tell us more..."
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="cf-submit" id="cf-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
          <div className={`cf-success${success ? ' show' : ''}`} id="cf-success">
            <div className="cf-success-icon">✓</div>
            <h4>Thanks!</h4>
            <p>Your feedback helps us improve.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
