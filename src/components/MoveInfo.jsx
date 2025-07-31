import React from 'react';

// Move Info component
const MoveInfo = React.memo(({ move, isDropZone = false }) => {
  if (isDropZone) {
    return (
      <div style={{
        border: '2px dashed #007bff',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        background: '#f8f9fa',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          background: '#6c757d',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
        }}>
          📄
        </div>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          Drag & Drop Load Here
        </div>
      </div>
    );
  }

  if (!move) {
    return null;
  }

  return (
    <div style={{ 
      padding: '12px',
      height: '100%',
      minHeight: '120px',
      border: move.lastUpdated ? '2px solid #4caf50' : '1px solid transparent',
      borderRadius: '4px',
      background: move.lastUpdated ? '#f8fff8' : 'transparent',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflow: 'visible', // Allow content to expand naturally
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <span style={{ color: '#007bff', fontWeight: '500', fontSize: '14px' }}>
            {move.taskId}
          </span>
          <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
            {move.size}
          </span>
          {move.lastUpdated && (
            <span style={{
              fontSize: '10px',
              color: '#4caf50',
              marginLeft: '4px',
              fontWeight: 'bold',
            }}>
              ●
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button style={{
            width: '24px',
            height: '24px',
            background: '#28a745',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
          }}>
            ✓
          </button>
          <button style={{
            width: '24px',
            height: '24px',
            background: '#dc3545',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
          }}>
            ✕
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
        Assigned: {move.assignedDate} • {move.assignedTime}
        {move.assignedDriver && (
          <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
            Driver: {move.assignedDriver}
          </div>
        )}
        {move.lastUpdated && (
          <div style={{ fontSize: '9px', color: '#ccc', marginTop: '1px' }}>
            Updated: {new Date(move?.lastUpdated).toLocaleTimeString('hh:mm:ss')}
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2px', 
        flex: 1,
        overflow: 'visible', // Allow content to expand naturally
        // Remove maxHeight constraint to let content determine row height
      }}>
        {move.tasks.map((task, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#6c757d',
            }} />
            <span>{task.name}</span>
            {task.voidOut && (
              <span style={{
                background: '#dc3545',
                color: 'white',
                fontSize: '10px',
                padding: '1px 4px',
                borderRadius: '2px',
                marginLeft: '4px',
              }}>
                Void Out
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

MoveInfo.displayName = 'MoveInfo';

export default MoveInfo;