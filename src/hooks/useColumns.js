import { useState, useMemo } from 'react';
import { COLUMNS } from '../constants/tableColumns';

export const useColumns = (containerWidth) => {
  const [showDriverColumn, setShowDriverColumn] = useState(true);

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

  return {
    showDriverColumn,
    setShowDriverColumn,
    visibleColumnConfigs,
    visibleColumnWidths,
    totalTableWidth,
    stickyPositions
  };
};