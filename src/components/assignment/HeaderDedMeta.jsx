import React, { useEffect, useState } from 'react';
import { GM_setValue, GM_getValue } from '$';

export default function HeaderDedMeta() {
  const [count, setCount] = useState(() => GM_getValue('bbep_ded_count', 5));
  const [step, setStep] = useState(() => GM_getValue('bbep_ded_step', 1));

  useEffect(() => {
    GM_setValue('bbep_ded_count', count);
    window.dispatchEvent(new CustomEvent('bbep:dedConfig', { detail: { count } }));
  }, [count]);

  useEffect(() => {
    GM_setValue('bbep_ded_step', step);
    window.dispatchEvent(new CustomEvent('bbep:dedConfig', { detail: { step } }));
  }, [step]);

  const onCount = (e) => {
    const v = Math.max(1, Math.min(100, parseInt(e.target.value || '0', 10)));
    setCount(v);
  };
  const onStep = (e) => {
    let v = parseFloat(e.target.value || '');
    if (!isFinite(v) || v <= 0) v = 1;
    v = Math.min(100, Math.max(0.001, v));
    setStep(v);
  };

  return (
    <span className='bbep-header-meta'>
      <span className='meta-item'>
        <label>题目数</label>
        <input
          className='bbep-ded-count-input'
          type='number'
          min='1'
          max='100'
          value={count}
          onChange={onCount}
        />
      </span>
      <span className='meta-item'>
        <label>步长</label>
        <input
          className='bbep-ded-step-input'
          type='number'
          min='0.001'
          step='0.1'
          value={step}
          onChange={onStep}
        />
      </span>
    </span>
  );
}

