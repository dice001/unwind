import { BACKGROUND_PATTERNS, getPatternWithColor } from '@wix/inbox-common';
import _findKey from 'lodash/findKey';
import { getRgbA } from '../services/colors';

export const generateBackgroundPatternObject = async (
  patternKey: string,
  patternOpacity: number,
  patternBackground: string,
) => {
  const backgroundPatternData = (_findKey as any)(BACKGROUND_PATTERNS, [
    'key',
    patternKey,
  ]);
  const backgroundPatternSize =
    BACKGROUND_PATTERNS[backgroundPatternData].backgroundSize;

  const backgroundGroup =
    BACKGROUND_PATTERNS[backgroundPatternData]?.backgroundGroup;

  let backgroundPatternAsset;

  if (patternKey === BACKGROUND_PATTERNS.NONE.key) {
    backgroundPatternAsset = await BACKGROUND_PATTERNS[
      backgroundPatternData
    ].getAsset();
  } else {
    const backgroundPatternColorOpacity =
      backgroundGroup === 'phase1'
        ? patternOpacity / 100
        : BACKGROUND_PATTERNS[backgroundPatternData].opacity;

    const backgroundPatternRgba = getRgbA(
      backgroundGroup === 'phase1' ? '#000000' : patternBackground,
      backgroundPatternColorOpacity,
    );

    const rawSvg = (
      await import(
        `@wix/inbox-common/dist/src/assets/backgroundPatterns/${patternKey}.js`
      )
    ).default;
    backgroundPatternAsset = getPatternWithColor(rawSvg, backgroundPatternRgba);
  }

  return {
    asset: backgroundPatternAsset,
    backgroundSize: backgroundPatternSize,
  };
};
