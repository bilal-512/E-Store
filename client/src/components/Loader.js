import React from 'react';

const Loader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  }}>
    <div className="loading-spinner" style={{ width: 48, height: 48, borderWidth: 6, borderTopColor: '#00B8D9' }} />
  </div>
);

export default Loader; 