import {useState} from 'react';

export interface IsProcessingHook {
  isProcessingState: boolean;
  setIsProcessingState: (isProcessing: boolean) => void;
}

function useIsProcessing(): IsProcessingHook {
  const [isProcessingState, setIsProcessingState] = useState<boolean>(false);

  return {
    isProcessingState,
    setIsProcessingState,
  };
}

export default useIsProcessing;
