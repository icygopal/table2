import { useMemo } from 'react';

export const useVisibleColumns = (
  columnVirtualization,
  horizontalScrollLeft,
  containerWidth,
  totalTableWidth,
  visibleColumnConfigs
) => {
  return useMemo(() => {
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
};

export const useVisibleRows = (rowVirtualization) => {
  return useMemo(() => {
    return rowVirtualization.visibleRows || [];
  }, [rowVirtualization]);
};