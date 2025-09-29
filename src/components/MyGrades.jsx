import React, { useEffect, useState } from 'react';
import { fetchAllMyGrades } from './fetchMyGrades';

function formatDateTime(ms) {
  if (!isFinite(ms)) return '';
  try {
    const d = new Date(ms);
    return d.toLocaleString();
  } catch (_) { return ''; }
}

export default function MyGrades({ items: presetItems, updatedAt, updatedFresh = false }) {
  const [items, setItems] = useState(presetItems || null);
  const [error, setError] = useState(null);
  const [ts, setTs] = useState(Date.now());
  const [selfFresh, setSelfFresh] = useState(false);

  useEffect(() => {
    try {
      if (Array.isArray(items)) {
        console.log('[BBEP MyGrades] render items length:', items.length);
      }
    } catch (_) {}
  }, [items]);

  useEffect(() => {
    if (presetItems && Array.isArray(presetItems)) {
      setItems(presetItems);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const data = await fetchAllMyGrades();
        if (alive) { setItems(data); setTs(Date.now()); setSelfFresh(true); }
      } catch (e) {
        if (alive) setError('Failed to load grades');
      }
    })();
    return () => { alive = false; };
  }, [ts, presetItems]);

  const shownUpdatedAt = updatedAt || ts;

  const toolbar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px 0' }}>
      <div style={{ fontSize: '12px', color: '#666' }}>
        Updated: {new Date(shownUpdatedAt).toLocaleTimeString()} { (updatedFresh || selfFresh) ? '已更新' : '' }
      </div>
    </div>
  );

  if (error) return <div>{toolbar}<div style={{ padding: '8px', color: '#b00' }}>{error}</div></div>;
  if (!items) return <div>{toolbar}<div style={{ padding: '8px' }}>Loading grades…</div></div>;
  if (!items.length) return <div>{toolbar}<div style={{ padding: '8px' }}>No recent grades.</div></div>;

  return (
    <div style={{ padding: '8px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {toolbar}
      <div style={{ display: 'grid', gap: '8px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: '12px', padding: '10px 12px', borderRadius: '6px', background: '#f6f7f9', border: '1px solid #e3e6ea', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.courseName}{it.itemType ? ` - ${it.itemType}` : ''}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#222', marginTop: '2px', overflowWrap: 'anywhere' }}>
                {it.itemName || '(Unnamed)'}
              </div>
              {it.dueText && String(it.dueText).trim() ? (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  {it.dueText}
                </div>
              ) : null}
            </div>
            <div style={{ textAlign: 'right', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
              <div style={{ fontWeight: 700, fontSize: '18px', color: '#111' }}>{it.gradeText}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {it.lastActivityText || (isFinite(it.lastActivityMs) ? formatDateTime(it.lastActivityMs) : '')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
