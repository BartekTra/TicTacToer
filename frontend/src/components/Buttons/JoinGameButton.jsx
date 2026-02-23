import React from 'react';

export const JoinGameButton = ({ label, onClickButton, type = 'button' }) => {


  return (
    <button type={type} onClick={onClickButton} className={'bg-gray-600 active:bg-gray-800 rounded-xl p-2'}>
      {label}
    </button>
  );
};

export default JoinGameButton;