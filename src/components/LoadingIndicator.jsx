import React from 'react';

const LoadingIndicator = () => {
  return (
    <div
      style={{ 
        height: '60px',
        padding: '20px',
        textAlign: 'center',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '14px', color: '#6c757d' }}>
        Loading more data...
      </div>
    </div>
  );
};

export default LoadingIndicator;