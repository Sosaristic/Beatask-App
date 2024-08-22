import {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';

const useAutoScroll = (dataLength: number, intervalTime: number = 3000) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex === dataLength - 1 ? 0 : prevIndex + 1;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({index: nextIndex, animated: true});
        }
        return nextIndex;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [dataLength, intervalTime]);

  return flatListRef;
};

export default useAutoScroll;
