

const getSpectrumWrapper = () => document.querySelector(".spectrum-wrapper");

  const spectrumRanges = [
    { from: [255, 0, 0], to: [255, 255, 0] },
    { from: [255, 255, 0], to: [0, 255, 0] },
    { from: [0, 255, 0], to: [0, 255, 255] },
    { from: [0, 255, 255], to: [0, 0, 255] },
    { from: [0, 0, 255], to: [255, 0, 255] },
    { from: [255, 0, 255], to: [255, 0, 0] }
  ];
  
  const findColorValue = (from, to, leftDistRatio) => {
    return Math.round(from + (to - from) * leftDistRatio);
  };
  
  const findRgbFromMousePosition = (event) => {
    const { left, width } = getSpectrumWrapper().getBoundingClientRect();
    const leftDistance = Math.min(Math.max(event.clientX - left, 0), width - 1);
    const rangeWidth = width / spectrumRanges.length;
    const includedRange = Math.floor(leftDistance / rangeWidth);
    const leftDistRatio = ((leftDistance % rangeWidth) / rangeWidth).toFixed(2);
    const { from, to } = spectrumRanges[includedRange];
    return {
      r: findColorValue(from[0], to[0], leftDistRatio),
      g: findColorValue(from[1], to[1], leftDistRatio),
      b: findColorValue(from[2], to[2], leftDistRatio)
    };
  };
  
  const darken = (color, ratio) => Math.round((1 - ratio) * color);
  const whiten = (color, ratio) => Math.round(color + (255 - color) * ratio);
  const adjustSaturation = ({ r, g, b }) => (ratio, adjustmentFn) => {
    return {
      r: adjustmentFn(r, ratio),
      g: adjustmentFn(g, ratio),
      b: adjustmentFn(b, ratio)
    };
  };
  
  const saturate = (rgb, e) => {
    const { top, height } = getSpectrumWrapper().getBoundingClientRect();
    const topDistance = Math.min(Math.max(e.clientY - top, 0), height);
    const topDistRatio = (topDistance / height).toFixed(2);
    if (topDistRatio > 0.5) {
      const darknessRatio = (topDistRatio - 0.5) / 0.5;
      return adjustSaturation(rgb)(darknessRatio, darken);
    }
    if (topDistRatio < 0.5) {
      const whitenessRatio = (0.5 - topDistRatio) / 0.5;
      return adjustSaturation(rgb)(whitenessRatio, whiten);
    }
    return rgb;
  };
  
  const rgbToHex = (r, g, b) => {
    const toHex = (rgb) => {
      let hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = `0${hex}`;
      }
      return hex;
    };
    const red = toHex(r);
    const green = toHex(g);
    const blue = toHex(b);
    return `#${red}${green}${blue}`;
  };

  // getSpectrumWrapper().addEventListener("click", (e) => {
  //   const rgb = findRgbFromMousePosition(e);
  // })
  
  getSpectrumWrapper().addEventListener("click", (e) => {
    const rgb = findRgbFromMousePosition(e);
    const { r, g, b } = saturate(rgb, e);
    const hexValue = rgbToHex(r, g, b);
    document.querySelector(".red").innerText = r;
    document.querySelector(".green").innerText = g;
    document.querySelector(".blue").innerText = b;
    document.querySelector(".hex").innerText = hexValue;
  });

  // module.exports = colorspectrum;