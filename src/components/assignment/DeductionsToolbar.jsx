import React, { useEffect, useState } from 'react';
import { GM_setValue, GM_getValue } from '$';

function writeDeductionsToFeedback(values) {
  try {
    const iframe = document.querySelector('#feedbacktext_ifr');
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;
    const body = doc.documentElement.querySelector('body');
    if (!body) return;

    const lines = [];
    for (let i = 0; i < values.length; i++) {
      const v = Number(values[i]) || 0;
      if (v > 0) lines.push(`${i + 1}.-${v}`);
    }

    let holder = doc.getElementById('bbep-deductions');
    if (!holder) {
      holder = doc.createElement('div');
      holder.id = 'bbep-deductions';
      body.insertBefore(holder, body.firstChild);
    }
    holder.innerHTML = '';
    lines.forEach((l) => {
      const lineDiv = doc.createElement('div');
      lineDiv.textContent = l;
      holder.appendChild(lineDiv);
    });
    body.dispatchEvent(new Event('input', { bubbles: true }));
  } catch (e) {}
}

export default function DeductionsToolbar() {
  const [count, setCount] = useState(() => GM_getValue('bbep_ded_count', 5));
  const [step, setStep] = useState(() => GM_getValue('bbep_ded_step', 1));
  const [values, setValues] = useState(() => {
    const n = typeof count === 'number' ? count : 5;
    return new Array(n).fill(0);
  });

  useEffect(() => {
    setValues((prev) => {
      const next = [...prev];
      if (count > next.length) {
        while (next.length < count) next.push(0);
      } else if (count < next.length) {
        next.length = count;
      }
      return next;
    });
  }, [count]);

  useEffect(() => {
    GM_setValue('bbep_ded_count', count);
    writeDeductionsToFeedback(values);
  }, [count, values]);

  useEffect(() => {
    GM_setValue('bbep_ded_step', step);
  }, [step]);

  useEffect(() => {
    const onCfg = (e) => {
      const d = e.detail || {};
      if (typeof d.count === 'number') setCount(d.count);
      if (typeof d.step === 'number') setStep(d.step);
    };
    window.addEventListener('bbep:dedConfig', onCfg);
    return () => window.removeEventListener('bbep:dedConfig', onCfg);
  }, []);

  const handleValueChange = (idx, v) => {
    const num = Math.max(0, parseFloat(v || '')) || 0;
    setValues((prev) => {
      const next = [...prev];
      next[idx] = num;
      return next;
    });
  };

  return (
    <div className='bbep-deductions-bar'>
      <div className='bbep-deductions-grid'>
        {values.map((val, i) => (
          <div className='bbep-ded-cell' key={i}>
            <div className='bbep-ded-label'>{i + 1}</div>
            <input
              className='bbep-ded-input'
              type='number'
              min='0'
              step={step}
              placeholder='0'
              value={val === 0 ? '' : val}
              onChange={(e) => handleValueChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

