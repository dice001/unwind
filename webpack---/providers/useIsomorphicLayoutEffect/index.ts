import { useLayoutEffect, useEffect } from 'react';
import { isBrowser } from '../../core/commons/utils';

export const useIsomorphicLayoutEffect = isBrowser()
  ? useLayoutEffect
  : useEffect;
