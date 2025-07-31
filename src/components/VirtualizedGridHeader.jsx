import React from 'react';

// Virtualized Grid Header component
const VirtualizedGridHeader = React.memo(({ columnWidths, visibleColumns, horizontalScrollLeft, visibleColumnConfigs, stickyPositions }) => {
  // Create grid template columns string from columnWidths
  const gridTemplateColumns = visibleColumns.map(columnIndex => 
    `${columnWidths[columnIndex]}px`
  ).join(' ');

  return (
    <div style={{
      background: '#f8f9fa',
      borderBottom: '2px solid #dee2e6',
      fontWeight: '600',
      fontSize: '14px',
      color: '#495057',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      height: '40px',
      display: 'grid',
      gridTemplateColumns,
    }}>
      {visibleColumns.map((columnIndex) => {
        const column = visibleColumnConfigs[columnIndex];
        const stickyLeft = stickyPositions[columnIndex] || 0;
        return (
          <div
            key={column.key}
            style={{
              padding: '8px 12px',
              borderRight: columnIndex < visibleColumnConfigs.length - 1 ? '1px solid #dee2e6' : 'none',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              minHeight: '20px',
              position: 'relative',
              // Make column sticky if sticky property is true
              ...(column.sticky && {
                position: 'sticky',
                left: stickyLeft,
                zIndex: 15,
                background: '#f8f9fa',
                borderRight: '2px solid #dee2e6',
                boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
              }),
            }}
          >
            {column.title}
          </div>
        );
      })}
    </div>
  );
});

VirtualizedGridHeader.displayName = 'VirtualizedGridHeader';

export default VirtualizedGridHeader;