import React from 'react';
import { MIN_ROW_HEIGHT } from '../constants/tableColumns';

// Virtualized Grid Cell component
const VirtualizedGridCell = React.memo(React.forwardRef(({ content, columnKey, rowBackground, rowHeight, isSticky, stickyLeft }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        minHeight: MIN_ROW_HEIGHT,
        padding: '0',
        borderRight: '1px solid #e9ecef',
        borderBottom: '1px solid #e9ecef',
        overflow: 'visible', // Allow content to expand naturally
        display: 'flex',
        alignItems: 'stretch',
        // Make column sticky if sticky property is true
        ...(isSticky && {
          position: 'sticky',
          left: stickyLeft || 0,
          zIndex: 12,
          background: rowBackground || '#ffffff',
          borderRight: '2px solid #dee2e6',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
        }),
      }}
    >
      {content}
    </div>
  );
}));

VirtualizedGridCell.displayName = 'VirtualizedGridCell';

export default VirtualizedGridCell;