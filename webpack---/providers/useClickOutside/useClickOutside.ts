import * as React from 'react';

export const useClickOutside = (
  toExclude:
    | Array<React.RefObject<HTMLElement | SVGElement> | undefined>
    | Array<HTMLElement | null>,
  onClickOutside: () => void,
  useCapture: boolean = true,
) => {
  React.useEffect(
    () => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target) {
          return;
        }

        for (const candidateToExclude of toExclude) {
          if (candidateToExclude instanceof HTMLElement) {
            if (candidateToExclude && candidateToExclude.contains(target)) {
              return;
            }
          } else {
            if (candidateToExclude?.current?.contains(target)) {
              return;
            }
          }
        }
        onClickOutside();
      };

      document.addEventListener('click', handleClickOutside, useCapture);
      return () => {
        document.removeEventListener('click', handleClickOutside, useCapture);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...toExclude, onClickOutside],
  );
};
