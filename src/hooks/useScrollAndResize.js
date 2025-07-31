import { useState, useCallback, useRef, useEffect } from 'react';

export const useScrollAndResize = (loadMoreData, isLoadingMore) => {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(600);
  const [horizontalScrollLeft, setHorizontalScrollLeft] = useState(0);
  const [verticalScrollTop, setVerticalScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);

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

  return {
    containerWidth,
    containerHeight,
    horizontalScrollLeft,
    verticalScrollTop,
    scrollContainerRef,
    handleResize,
    handleScroll
  };
};