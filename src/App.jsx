import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


// Table column configuration for logistics dashboard
const COLUMNS = [
  { 
    key: 'driver', 
    title: 'Driver', 
    minWidth: 300,
    maxWidth: 350,
    flex: 0,
    sticky: true // Make driver column sticky by default
  },
  { 
    key: 'move1', 
    title: 'Move 1', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move2', 
    title: 'Move 2', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move3', 
    title: 'Move 3', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move4', 
    title: 'Move 4', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move5', 
    title: 'Move 5', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move6', 
    title: 'Move 6', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: true
  },
  { 
    key: 'move7', 
    title: 'Move 7', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move8', 
    title: 'Move 8', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move9', 
    title: 'Move 9', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move10', 
    title: 'Move 10', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move11', 
    title: 'Move 11', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move12', 
    title: 'Move 12', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move13', 
    title: 'Move 13', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  },
  { 
    key: 'move14', 
    title: 'Move 14', 
    minWidth: 250,
    maxWidth: 300,
    flex: 1,
    sticky: false
  }
];

// Virtualization configuration
const MIN_ROW_HEIGHT = 120; // Minimum row height for virtualization
const MAX_ROW_HEIGHT = 3000; // Maximum row height - significantly increased for large task lists
const OVERSCAN_ROWS = 8; // Increased to 8 for better performance with tall rows and smoother scrolling
const OVERSCAN_COLUMNS = 1; // Number of extra columns to render left/right of viewport

// Dynamic row height calculation function - truly responsive to content with optimized accuracy
const calculateRowHeight = (row) => {
  let maxHeight = MIN_ROW_HEIGHT;

  // Check driver column - fixed height
  if (row.driver) {
    maxHeight = Math.max(maxHeight, 150); // Consistent driver height
  }

  // Dynamically get all move columns from COLUMNS config, filter out 'driver'
  const moveColumns = COLUMNS
    .filter(col => col.key !== 'driver')
    .map(col => col.key);

  moveColumns.forEach(columnKey => {
    const move = row[columnKey];
    if (move && move.tasks) {
      const headerHeight = 34; // Task ID, size, and action buttons (with margins) - more accurate
      const metadataHeight = 48; // Assigned date/time, driver, last updated - more accurate
      const taskHeight = 18; // Height per task (12px font + 4px gap + 2px line spacing) - more accurate
      const padding = 24; // Total padding (12px top + 12px bottom)
      const buttonSpacing = 12; // Additional space for buttons and margins - increased for better spacing
      const taskCount = move.tasks.length || 0;

      // Enhanced calculation for very large task lists with better accuracy
      let moveHeight = headerHeight + metadataHeight + padding + buttonSpacing;

      // Add height for tasks with improved calculation for large lists
      if (taskCount > 0) {
        // For very large task lists, use slightly more spacing to prevent cramping
        const adjustedTaskHeight = taskCount > 50 ? taskHeight + 2 : taskHeight;
        moveHeight += (taskCount * adjustedTaskHeight);

        // Add extra spacing for very large task lists to improve readability
        if (taskCount > 100) {
          moveHeight += Math.min(50, Math.floor(taskCount / 20) * 5); // Progressive spacing increase
        }
      }

      maxHeight = Math.max(maxHeight, moveHeight);
    }
  });
  
  // Apply MAX_ROW_HEIGHT as a safety limit but ensure minimum usability
  const finalHeight = Math.min(maxHeight, MAX_ROW_HEIGHT);
  
  // Ensure we never go below minimum height
  return Math.max(finalHeight, MIN_ROW_HEIGHT);
};

// Driver component
const DriverInfo = React.memo(({ driver }) => (
  <div style={{ 
    padding: '12px', 
    height: '100%', 
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#6c757d',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
      }}>
        {driver.id}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
          {driver.id} {driver.name}
        </div>
      </div>
      <div style={{
        width: '16px',
        height: '16px',
        background: '#007bff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        borderRadius: '2px',
      }}>
        {driver.status}
      </div>
    </div>
    
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
      <div>ETA -</div>
      <div>Truck # {driver.truckNumber || '-'}</div>
      <div>Chassis # -</div>
      <div>Size -</div>
    </div>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '4px',
      fontSize: '11px',
      color: '#721c24'
    }}>
      <div style={{ fontSize: '11px', color: '#721c24' }}>Drive: -</div>
      <div style={{ fontSize: '11px', color: '#721c24' }}>Break: -</div>
    </div>
  </div>
));

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

// Generate table data
const generateTableData = (startIndex = 0, count = 30) => {
  const drivers = [
    { id: 'D001', name: 'John Smith', status: 'A', truckNumber: 'T001' },
    { id: 'D002', name: 'Jane Doe', status: 'A', truckNumber: 'T002' },
    { id: 'D003', name: 'Mike Johnson', status: 'B', truckNumber: 'T003' },
    { id: 'D004', name: 'Sarah Wilson', status: 'A', truckNumber: 'T004' },
    { id: 'D005', name: 'Tom Brown', status: 'C', truckNumber: 'T005' },
  ];

  const moves = [
    {
      taskId: 'T_001110',
      size: '40HC',
      assignedDate: '12/15',
      assignedTime: '09:30 AM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        
      ]
    },
    {
      taskId: 'T_001111',
      size: '20GP',
      assignedDate: '12/15',
      assignedTime: '10:15 AM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Pick up from warehouse', voidOut: false },
        { name: 'Deliver to distribution center', voidOut: false },
      ]
    },
    {
      taskId: 'T_001112',
      size: '40HC',
      assignedDate: '12/15',
      assignedTime: '11:00 AM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Port pickup', voidOut: false },
        { name: 'Deliver to customer', voidOut: false },
        { name: 'Return to port', voidOut: false },
      ]
    },
    {
      taskId: 'T_001113',
      size: '20GP',
      assignedDate: '12/15',
      assignedTime: '01:30 PM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Yard to warehouse', voidOut: false },
        { name: 'Warehouse to customer', voidOut: false },
      ]
    },
    {
      taskId: 'T_001114',
      size: '40HC',
      assignedDate: '12/15',
      assignedTime: '02:45 PM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Port to yard', voidOut: false },
        { name: 'Yard to customer', voidOut: false },
        { name: 'Customer to yard', voidOut: true },
      ]
    },
  ];

  const rows = [];
  for (let i = 0; i < count; i++) {
    const driverIndex = (startIndex + i) % drivers.length;
    const moveIndex = (startIndex + i) % moves.length;
    
    rows.push({
      id: `driver-${startIndex + i + 1}`,
      driver: drivers[driverIndex],
      move1: Math.random() > 0.3 ? { ...moves[moveIndex] } : null,
      move2: Math.random() > 0.4 ? { ...moves[(moveIndex + 1) % moves.length] } : null,
      move3: Math.random() > 0.5 ? { ...moves[(moveIndex + 2) % moves.length] } : null,
      move4: Math.random() > 0.6 ? { ...moves[(moveIndex + 3) % moves.length] } : null,
      move5: Math.random() > 0.7 ? { ...moves[(moveIndex + 4) % moves.length] } : null,
      move6: Math.random() > 0.75 ? { ...moves[(moveIndex + 0) % moves.length] } : null,
      move7: Math.random() > 0.8 ? { ...moves[(moveIndex + 1) % moves.length] } : null,
      move8: Math.random() > 0.85 ? { ...moves[(moveIndex + 2) % moves.length] } : null,
      move9: Math.random() > 0.9 ? { ...moves[(moveIndex + 3) % moves.length] } : null,
      move10: Math.random() > 0.92 ? { ...moves[(moveIndex + 4) % moves.length] } : null,
      move11: Math.random() > 0.94 ? { ...moves[(moveIndex + 0) % moves.length] } : null,
      move12: Math.random() > 0.96 ? { ...moves[(moveIndex + 1) % moves.length] } : null,
      move13: Math.random() > 0.97 ? { ...moves[(moveIndex + 2) % moves.length] } : null,
      move14: Math.random() > 0.98 ? { ...moves[(moveIndex + 3) % moves.length] } : null,
    });
  }
  return rows;
};

// Draggable Move Cell component using react-dnd
const DraggableMoveCell = React.memo(({ move, rowIndex, columnKey, onMoveAssignment }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'MOVE_ASSIGNMENT',
    item: { 
      move, 
      sourceRowIndex: rowIndex, 
      sourceColumnKey: columnKey,
      id: `${rowIndex}-${columnKey}`
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'MOVE_ASSIGNMENT',
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      if (item.sourceRowIndex === rowIndex && item.sourceColumnKey === columnKey) {
        return;
      }
      // Don't drop on driver column
      if (columnKey === 'driver') {
        return;
      }
    },
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      if (item.sourceRowIndex === rowIndex && item.sourceColumnKey === columnKey) {
        return;
      }
      // Don't drop on driver column
      if (columnKey === 'driver') {
        return;
      }
      onMoveAssignment(item.sourceRowIndex, item.sourceColumnKey, rowIndex, columnKey);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  if (!move) {
    return (
      <div
        ref={drop}
        style={{
          height: '100%',
          width: '100%',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isOver ? '#e8f5e8' : 'transparent',
          border: isOver ? '2px dashed #4caf50' : '1px dashed #e0e0e0',
          borderRadius: '4px',
          margin: '0',
          padding: '12px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ color: '#999', fontSize: '12px' }}>
          {isOver ? 'Drop here' : 'Empty'}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        height: '100%',
        width: '100%',
        cursor: 'grab',
        opacity: isDragging ? 0.8 : 1,
        transform: isDragging ? 'rotate(1deg) scale(1.01)' : 'none',
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        zIndex: isDragging ? 1000 : 'auto',
        boxShadow: isDragging 
          ? '0 4px 12px rgba(0,0,0,0.2)' 
          : 'none',
        boxSizing: 'border-box',
      }}
    >
      <MoveInfo move={move} />
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimize re-renders by comparing props
  return (
    prevProps.move === nextProps.move &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.columnKey === nextProps.columnKey
  );
});

// Virtualized Grid Cell component
const VirtualizedGridCell = React.memo(({ content, columnKey, rowBackground, rowHeight, isSticky, stickyLeft }) => {
  return (
    <div
      style={{
        height: rowHeight,
        minHeight: rowHeight,
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
});

VirtualizedGridCell.displayName = 'VirtualizedGridCell';

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

// Virtualized Grid Row component (non-draggable)
const VirtualizedGridRow = React.memo(({ 
  row, 
  index, 
  columnWidths,
  visibleColumns,
  visibleColumnConfigs,
  rowHeight,
  onMoveAssignment,
  stickyPositions
}) => {
  const rowBackground = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
  
  // Create grid template columns string from columnWidths
  const gridTemplateColumns = visibleColumns.map(columnIndex => 
    `${columnWidths[columnIndex]}px`
  ).join(' ');
  
  return (
    <div
      style={{
        background: rowBackground,
        height: rowHeight,
        minHeight: rowHeight,
        maxHeight: rowHeight,
        willChange: 'transform', // Optimize for animations
        contain: 'layout style', // Optimize rendering performance
        display: 'grid',
        gridTemplateColumns,
      }}
    >
      {visibleColumns.map((columnIndex, colIndex) => {
        const column = visibleColumnConfigs[columnIndex];
        const cellKey = `${column.key}-${index}`;
        const stickyLeft = stickyPositions[columnIndex] || 0;
        return (
          <VirtualizedGridCell
            key={cellKey}
            content={
              column.key === 'driver' ? (
                <DriverInfo driver={row.driver} />
              ) : (
                <DraggableMoveCell
                  move={row[column.key]}
                  rowIndex={index}
                  columnKey={column.key}
                  onMoveAssignment={onMoveAssignment}
                />
              )
            }
            columnKey={column.key}
            rowBackground={rowBackground}
            rowHeight={rowHeight}
            isSticky={column.sticky}
            stickyLeft={stickyLeft}
          />
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.row === nextProps.row &&
    prevProps.index === nextProps.index &&
    prevProps.rowHeight === nextProps.rowHeight &&
    JSON.stringify(prevProps.visibleColumns) === JSON.stringify(nextProps.visibleColumns) &&
    JSON.stringify(prevProps.columnWidths) === JSON.stringify(nextProps.columnWidths)
  );
});

VirtualizedGridRow.displayName = 'VirtualizedGridRow';

// AutoSizer component for dynamic container sizing
const AutoSizer = ({ children, onResize }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        onResize({ width, height });
      }
    };

    updateDimensions();

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // Fallback to window resize listener
      window.addEventListener('resize', updateDimensions);
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [onResize]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {children(dimensions)}
    </div>
  );
};



function App() {
  const [rows, setRows] = useState(() => generateTableData(0, 30));
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(600);
  const [horizontalScrollLeft, setHorizontalScrollLeft] = useState(0);
  const [verticalScrollTop, setVerticalScrollTop] = useState(0);
  const [tableVersion, setTableVersion] = useState(0);
  const [showDriverColumn, setShowDriverColumn] = useState(true); // Flag to show/hide driver column
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Loading state for infinite scroll
  const scrollContainerRef = useRef(null);

  // Update table version when rows change to trigger re-render with stable keys
  useEffect(() => {
    setTableVersion(prev => prev + 1);
  }, [rows]);


  // Get visible columns based on showDriverColumn flag
  const visibleColumnConfigs = useMemo(() => {
    return COLUMNS.filter(col => col.key !== 'driver' || showDriverColumn);
  }, [showDriverColumn]);

  // Calculate column widths for visible columns
  const visibleColumnWidths = useMemo(() => {
    const totalFlexWidth = containerWidth - visibleColumnConfigs.reduce((sum, col) => sum + (col.flex === 0 ? col.minWidth : 0), 0);
    const totalFlex = visibleColumnConfigs.reduce((sum, col) => sum + col.flex, 0);
    
    return visibleColumnConfigs.map(col => {
      if (col.flex === 0) return col.minWidth;
      const flexWidth = (totalFlexWidth * col.flex) / totalFlex;
      return Math.min(Math.max(flexWidth, col.minWidth), col.maxWidth);
    });
  }, [containerWidth, visibleColumnConfigs]);

  // Calculate total table width
  const totalTableWidth = useMemo(() => {
    return visibleColumnWidths.reduce((sum, width) => sum + width, 0);
  }, [visibleColumnWidths]);

  // Calculate row heights with stable calculation to prevent flickering
  const rowHeights = useMemo(() => {
    return rows.map((row) => calculateRowHeight(row));
  }, [rows]);

  // Calculate cumulative heights for virtualization
  const cumulativeHeights = useMemo(() => {
    const cumulative = [0];
    rowHeights.forEach((height, index) => {
      cumulative[index + 1] = cumulative[index] + height;
    });
    return cumulative;
  }, [rowHeights]);

  // Enhanced virtualization for variable heights with optimized performance for tall rows
  const rowVirtualization = useMemo(() => {
    if (!rowHeights || rowHeights.length === 0) {
      return {
        startIndex: 0,
        endIndex: Math.min(10, rows.length - 1),
        offsetY: 0,
        visibleRows: Array.from({ length: Math.min(10, rows.length) }, (_, i) => i)
      };
    }

    const availableHeight = containerHeight - 40; // Subtract header height
    
    // Use cumulative heights for more efficient calculation with tall rows
    let startIndex = 0;
    
    // Binary search for start index for better performance with many rows
    let low = 0;
    let high = rows.length - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cumulativeHeight = cumulativeHeights[mid];
      
      if (cumulativeHeight <= verticalScrollTop) {
        startIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    
    // Apply overscan with bounds checking
    startIndex = Math.max(0, startIndex - OVERSCAN_ROWS);
    
    // Find the end index with improved calculation for tall rows
    let endIndex = startIndex;
    let renderHeight = 0;
    
    // Calculate how many rows we need to render including overscan
    const targetHeight = availableHeight + (OVERSCAN_ROWS * 2 * MIN_ROW_HEIGHT);
    
    for (let i = startIndex; i < rows.length; i++) {
      renderHeight += rowHeights[i];
      endIndex = i;
      
      // Stop when we've rendered enough content plus overscan
      if (renderHeight > targetHeight) {
        // Add additional overscan for tall rows
        endIndex = Math.min(rows.length - 1, i + OVERSCAN_ROWS);
        break;
      }
    }
    
    // Ensure we don't exceed array bounds
    endIndex = Math.min(endIndex, rows.length - 1);
    
    // Calculate offset using cumulative heights for accuracy
    const offsetY = cumulativeHeights[startIndex] || 0;
    
    return {
      startIndex,
      endIndex,
      offsetY,
      visibleRows: Array.from({ length: Math.max(0, endIndex - startIndex + 1) }, (_, i) => startIndex + i)
    };
  }, [rows.length, verticalScrollTop, containerHeight, rowHeights, cumulativeHeights]);

  // Column virtualization
  const columnVirtualization = useMemo(() => {
    if (totalTableWidth <= containerWidth) {
      return {
        startIndex: 0,
        endIndex: visibleColumnConfigs.length - 1,
        offsetX: 0,
      };
    }

    let currentX = 0;
    let startIndex = 0;
    let endIndex = 0;

    // Find start column
    for (let i = 0; i < visibleColumnConfigs.length; i++) {
      if (currentX + visibleColumnWidths[i] > horizontalScrollLeft) {
        startIndex = Math.max(0, i - OVERSCAN_COLUMNS);
        break;
      }
      currentX += visibleColumnWidths[i];
    }

    // Find end column - ensure we don't hide columns at the end
    currentX = 0;
    for (let i = 0; i < visibleColumnConfigs.length; i++) {
      currentX += visibleColumnWidths[i];
      if (currentX > horizontalScrollLeft + containerWidth) {
        endIndex = Math.min(visibleColumnConfigs.length - 1, i + OVERSCAN_COLUMNS);
        break;
      }
      // If we reach the end, make sure to include all remaining columns
      if (i === visibleColumnConfigs.length - 1) {
        endIndex = visibleColumnConfigs.length - 1;
      }
    }

    // Ensure all sticky columns are always included if visible
    const stickyColumnIndices = visibleColumnConfigs
      .map((col, index) => col.sticky ? index : -1)
      .filter(index => index !== -1);
    
    if (stickyColumnIndices.length > 0 && startIndex > Math.min(...stickyColumnIndices)) {
      startIndex = Math.min(...stickyColumnIndices);
    }

    // Ensure we don't hide columns when scrolling reaches the end
    if (horizontalScrollLeft + containerWidth >= totalTableWidth) {
      endIndex = visibleColumnConfigs.length - 1;
    }

    // Calculate offset for start column
    let offsetX = 0;
    for (let i = 0; i < startIndex; i++) {
      offsetX += visibleColumnWidths[i];
    }

    return {
      startIndex,
      endIndex,
      offsetX,
    };
  }, [totalTableWidth, containerWidth, horizontalScrollLeft, visibleColumnWidths, visibleColumnConfigs, showDriverColumn]);

  // Calculate sticky positions for each column
  const stickyPositions = useMemo(() => {
    const positions = {};
    let currentLeft = 0;
    
    visibleColumnConfigs.forEach((col, index) => {
      if (col.sticky) {
        positions[index] = currentLeft;
        currentLeft += visibleColumnWidths[index] || 0;
      } else {
        positions[index] = 0;
      }
    });
    
    return positions;
  }, [visibleColumnConfigs, visibleColumnWidths]);

  // Get visible columns
  const visibleColumns = useMemo(() => {
    const columns = [];
    
    // Always include all sticky columns if they're visible and not already included
    const stickyColumnIndices = visibleColumnConfigs
      .map((col, index) => col.sticky ? index : -1)
      .filter(index => index !== -1);
    
    stickyColumnIndices.forEach(stickyIndex => {
      const hasStickyColumn = columnVirtualization.startIndex <= stickyIndex && 
                             columnVirtualization.endIndex >= stickyIndex;
      
      if (!hasStickyColumn) {
        columns.push(stickyIndex);
      }
    });
    
    // Add all columns in the virtualization range
    for (let i = columnVirtualization.startIndex; i <= columnVirtualization.endIndex; i++) {
      if (!columns.includes(i)) {
        columns.push(i);
      }
    }
    
    // If we're at the end of the scroll, ensure all columns are visible
    if (horizontalScrollLeft + containerWidth >= totalTableWidth - 10) { // 10px tolerance
      for (let i = 0; i < visibleColumnConfigs.length; i++) {
        if (!columns.includes(i)) {
          columns.push(i);
        }
      }
    }
    
    return columns.sort((a, b) => a - b);
  }, [columnVirtualization, horizontalScrollLeft, containerWidth, totalTableWidth, visibleColumnConfigs]);

  // Get visible rows
  const visibleRows = useMemo(() => {
    return rowVirtualization.visibleRows || [];
  }, [rowVirtualization]);

  // Handle container resize
  const handleResize = useCallback(({ width, height }) => {
    setContainerWidth(width);
    setContainerHeight(height);
  }, []);

  // Handle scroll with throttling to reduce flickering
  const handleScroll = useCallback((event) => {
    const scrollTop = event.target.scrollTop;
    const scrollLeft = event.target.scrollLeft;
    
    // Use requestAnimationFrame to throttle scroll updates
    requestAnimationFrame(() => {
      setVerticalScrollTop(scrollTop);
      setHorizontalScrollLeft(scrollLeft);
    });
  }, []);

  // Load more data when reaching the bottom
  const loadMoreData = useCallback(() => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newRows = generateTableData(rows.length, 30);
      setRows(prevRows => [...prevRows, ...newRows]);
      setIsLoadingMore(false);
    }, 500);
  }, [rows.length, isLoadingMore]);

  // Check if we need to load more data
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScrollCheck = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold
      
      if (isNearBottom && !isLoadingMore) {
        loadMoreData();
      }
    };

    scrollContainer.addEventListener('scroll', handleScrollCheck);
    return () => scrollContainer.removeEventListener('scroll', handleScrollCheck);
  }, [loadMoreData, isLoadingMore]);

  // Handle move assignment
  const handleMoveAssignment = useCallback((sourceRowIndex, sourceColumnKey, targetRowIndex, targetColumnKey) => {
    console.log('Moving assignment:', { sourceRowIndex, sourceColumnKey, targetRowIndex, targetColumnKey });
    
    setRows(prevRows => {
      const newRows = [...prevRows];
      const sourceMove = newRows[sourceRowIndex][sourceColumnKey];
      const targetMove = newRows[targetRowIndex][targetColumnKey];

      console.log('Source move:', sourceMove);
      console.log('Target move:', targetMove);

      // If dropping on an empty cell, move the assignment
      if (!targetMove) {
        newRows[sourceRowIndex] = {
          ...newRows[sourceRowIndex],
          [sourceColumnKey]: null
        };
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          [targetColumnKey]: {
            ...sourceMove,
            assignedDriver: newRows[targetRowIndex].driver.id,
          }
        };
      } else {
        // If dropping on another move, swap them
        newRows[sourceRowIndex] = {
          ...newRows[sourceRowIndex],
          [sourceColumnKey]: {
            ...targetMove,
            assignedDriver: newRows[sourceRowIndex].driver.id,
          }
        };
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          [targetColumnKey]: {
            ...sourceMove,
            assignedDriver: newRows[targetRowIndex].driver.id,
          }
        };
      }

      console.log('Updated rows:', newRows);
      return newRows;
    });
  }, []);



  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        height: 'calc(100vh - 100px)', 
        width: '100vw',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#ffffff',
        overflow: 'hidden',
      }}>
        {/* Toggle button for driver column */}
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
        </div>
        
        <div style={{ height: 'calc(100vh - 100px)', background: '#fff' }}>
          <AutoSizer onResize={handleResize}>
            {({ width, height }) => {
              const needsHorizontalScroll = totalTableWidth > width;
              
              return (
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  style={{ 
                    width, 
                    height,
                    overflowX: needsHorizontalScroll ? 'auto' : 'hidden',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth',
                    position: 'relative',
                  }}
                >
                  <div style={{ 
                    width: Math.max(width, totalTableWidth),
                    height: cumulativeHeights[rows.length] + 40, // Total height including header
                    position: 'relative',
                    minWidth: totalTableWidth, // Ensure minimum width to show all columns
                  }}>
                    <div
                      style={{
                        width: Math.max(width, totalTableWidth),
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <VirtualizedGridHeader 
                        columnWidths={visibleColumnWidths} 
                        visibleColumns={visibleColumns}
                        horizontalScrollLeft={horizontalScrollLeft}
                        visibleColumnConfigs={visibleColumnConfigs}
                        stickyPositions={stickyPositions}
                      />
                      <div>
                        {/* Spacer row for virtualized content above */}
                        {rowVirtualization.startIndex > 0 && (
                          <div
                            style={{ 
                              height: rowVirtualization.offsetY,
                              padding: 0,
                            }}
                          />
                        )}
                        
                        {/* Visible rows */}
                        {visibleRows.map((rowIndex) => {
                          const row = rows[rowIndex];
                          // Create a stable, simple key without expensive JSON serialization
                          const rowKey = `row-${row.id}-${rowIndex}-v${tableVersion}`;
                          return (
                            <VirtualizedGridRow
                              key={rowKey}
                              row={row}
                              index={rowIndex}
                              columnWidths={visibleColumnWidths}
                              visibleColumns={visibleColumns}
                              visibleColumnConfigs={visibleColumnConfigs}
                              rowHeight={rowHeights[rowIndex]}
                              onMoveAssignment={handleMoveAssignment}
                              stickyPositions={stickyPositions}
                            />
                          );
                        })}
                        
                        {/* Loading indicator */}
                        {isLoadingMore && (
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
                        )}
                        
                        {/* Spacer row for virtualized content below */}
                        {rowVirtualization.endIndex < rows.length - 1 && (
                          <div
                            style={{ 
                              height: cumulativeHeights[rows.length] - cumulativeHeights[rowVirtualization.endIndex + 1],
                              padding: 0,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </DndProvider>
  );
}

export default App; 