import {createContext} from 'react';
import {IsProcessingHook} from './useIsProcessing';

const INITIAL_IS_PROCESSING_HOOK: IsProcessingHook = {
  isProcessingState: false,
  setIsProcessingState: () => {},
};

const IsProcessingContext = createContext<IsProcessingHook>(
  INITIAL_IS_PROCESSING_HOOK,
);

export default IsProcessingContext;
