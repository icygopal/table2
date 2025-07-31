import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import MoveInfo from './MoveInfo';

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

DraggableMoveCell.displayName = 'DraggableMoveCell';

export default DraggableMoveCell;