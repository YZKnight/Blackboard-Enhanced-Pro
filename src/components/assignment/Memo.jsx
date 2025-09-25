import React from 'react';

function Memo({ props }) {
  const onInput = (e) => {
    const text = e.currentTarget.innerText;
    props.setEnv({
      ...props.env,
      assignment: {
        ...props.env.assignment,
        memo: text,
      },
    });
  };

  return (
    <div className='memo-container'>
      <div className='memo-box'>
        <div className='memo-list'>
          <div className='memo-input' contentEditable onInput={onInput}>
            {props.env.assignment.memo}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Memo;

