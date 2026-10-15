'use client';

import { useEffect, useState } from 'react';
import './economic-calendar-widget.css';

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function CalendarEvent({ event }) {
  const classes = ['econ-cal-event'];
  if (event.isVIP) classes.push('vip');
  if (event.isToday) classes.push('today');
  if (event.isPast) classes.push('past');

  return (
    <div className={classes.join(' ')}>
      <div className="econ-cal-time">
        <div className="econ-cal-time-relative">{event.relativeTime}</div>
      </div>
      <div className="econ-cal-content">
        <div className="econ-cal-event-title">
          <span className={`econ-cal-country ${event.country}`}>{event.country}</span>
          {event.title}
        </div>
        <div className="econ-cal-meta">
          <span>{formatDate(event.date)} {formatTime(event.date)}</span>
          {event.forecast ? <span className="econ-cal-forecast">Fcst: {event.forecast}</span> : null}
          {event.previous ? <span className="econ-cal-previous">Prev: {event.previous}</span> : null}
        </div>
      </div>
    </div>
  );
}

export default function EconomicCalendarWidget() {
  // status: 'loading' | 'empty' | 'ready' | 'error'
  const [status, setStatus] = useState('loading');
  const [events, setEvents] = useState([]);
  const [updatedText, setUpdatedText] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchCalendar() {
      try {
        const response = await fetch('/api/economic-calendar');
        const data = await response.json();
        if (cancelled) return;

        if (!data.upcoming || data.upcoming.length === 0) {
          setStatus('empty');
          return;
        }

        setEvents(data.upcoming.slice(0, 6));
        setStatus('ready');

        if (data.lastUpdated) {
          const updated = new Date(data.lastUpdated);
          setUpdatedText(`Updated ${updated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`);
        }
      } catch (error) {
        console.error('Error fetching calendar:', error);
        if (!cancelled) setStatus('error');
      }
    }

    fetchCalendar();
    // Refresh every hour
    const interval = setInterval(fetchCalendar, 60 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  let list;
  if (status === 'loading') {
    list = <div className="econ-cal-empty">Loading events...</div>;
  } else if (status === 'empty') {
    list = <div className="econ-cal-empty">No high-impact events this week</div>;
  } else if (status === 'error') {
    list = <div className="econ-cal-empty">Failed to load calendar</div>;
  } else {
    list = events.map((event, i) => (
      <CalendarEvent key={`${event.date}-${event.title}-${i}`} event={event} />
    ));
  }

  return (
    <div id="econ-cal-widget">
      <div className="econ-cal-widget">
        <div className="econ-cal-header">
          <div className="econ-cal-header-left">
            <span>📅</span>
            <span className="econ-cal-title">Economic Calendar</span>
          </div>
          <span className="econ-cal-badge">High Impact</span>
        </div>
        <div className="econ-cal-list" id="econ-cal-list">
          {list}
        </div>
        <div className="econ-cal-footer">
          <span className="econ-cal-source">
            Data: <a href="https://www.forexfactory.com/calendar" target="_blank">Forex Factory</a>
          </span>
          <span className="econ-cal-updated" id="econ-cal-updated">{updatedText}</span>
        </div>
      </div>
    </div>
  );
}
