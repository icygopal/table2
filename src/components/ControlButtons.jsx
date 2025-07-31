import React from 'react';

const ControlButtons = ({ 
  showDriverColumn, 
  setShowDriverColumn, 
  onClearData, 
  onLoadData 
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      background: '#fff',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      padding: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '8px',
    }}>
      <button
        onClick={() => setShowDriverColumn(!showDriverColumn)}
        style={{
          background: showDriverColumn ? '#28a745' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        {showDriverColumn ? 'Hide Driver' : 'Show Driver'}
      </button>
      <button
        onClick={onClearData}
        style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        Clear Data
      </button>
      <button
        onClick={onLoadData}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        Load Data
      </button>
    </div>
  );
};

export default ControlButtons;