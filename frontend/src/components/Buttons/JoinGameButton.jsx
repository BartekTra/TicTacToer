import React from 'react';

export const JoinGameButton = ({ label, onClickButton, type = 'button', className = '' }) => {

  const baseStyles =
    'bg-gray-600 active:bg-gray-800'


  return (
    <button type={type} onClick={onClickButton} className={`${baseStyles} ${className}`}>
      {label}
    </button>
  );
};

export default JoinGameButton;