const hexToRgbA = (hex, opacity) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
      ',',
    )},${opacity})`;
  }
  return '';
};

export const getRgbA = (color, opacity = 1) => {
  if (!color) {
    return '';
  }
  if (color.indexOf('#') === 0) {
    return hexToRgbA(color, opacity);
  }
  if (color.indexOf('rgb') === 0 && color.indexOf('a') !== 3) {
    return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
  }
  if (color.indexOf('rgba') === 0) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }
  return '';
};
