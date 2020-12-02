import React from 'react';
import './Loader.scss';

function Loader() {
  return (
    <div
      aria-label="loading"
      data-testid="loading"
      className="loader lds-spinner spiner-center"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loader;
