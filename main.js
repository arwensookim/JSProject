

const APP = {
  canvas: null,
  ctx: null,
  data: [],
  img: null,
  init() {
    APP.canvas = document.querySelector('main canvas');
    APP.ctx = APP.canvas.getContext('2d');
    APP.canvas.width = 900;
    APP.canvas.style.width = 900;
    APP.canvas.height = 600;
    APP.canvas.style.height = 600;
    APP.img = document.createElement('img');
    APP.img.id = 'imagePreview';
    APP.img.src = APP.canvas.getAttribute('data-src');

    APP.img.style.objectFit = "contain";
    APP.img.onload = (ev) => {
      APP.ctx.drawImage(APP.img, 0, 0, APP.canvas.width, APP.canvas.height);
      let imgDataObj = APP.ctx.getImageData(
        0,
        0,
        APP.canvas.width,
        APP.canvas.height
      );
      APP.data = imgDataObj.data; 

      APP.canvas.addEventListener('mousemove', APP.getPixel);
      APP.canvas.addEventListener('click', APP.addBox);
    };
    APP.canvas.addEventListener('click', APP.manipulate)

    const openModalButtons = document.querySelectorAll('[data-modal-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')

    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
      })
    })

    overlay.addEventListener('click', () => {
      const modals = document.querySelectorAll('.modal.active')
      modals.forEach(modal => {
        closeModal(modal)
      })
    })

    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
      })
    })

    function openModal(modal) {
      if (modal == null) return
      modal.classList.add('active')
      overlay.classList.add('active')
    }

    function closeModal(modal) {
      if (modal == null) return
      modal.classList.remove('active')
      overlay.classList.remove('active')
    }
      
  
  },
  getPixel(ev) {
    // APP.ctx.drawImage(APP.img, 0, 0, APP.img.width * .3, APP.img.height * .3);
    // let canvas = ev.target;
    let cols = APP.canvas.width;
    let { offsetX, offsetY } = ev;
    let c = APP.getPixelColor(cols, offsetY, offsetX);
    let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`; //${c.alpha / 255}

    APP.pixel = clr;
    APP.getAverage(ev);
  },
  
  getAverage(ev) {


    let cols = APP.canvas.width;
    let rows = APP.canvas.height;
    APP.ctx.clearRect(0, 0, cols, rows);
    // APP.ctx.drawImage(APP.img, 0, 0);
    APP.ctx.drawImage(APP.img, 0, 0, APP.canvas.width, APP.canvas.height);
    let { offsetX, offsetY } = ev;
    const inset = 20;
    offsetX = Math.min(offsetX, cols - inset);
    offsetX = Math.max(inset, offsetX);
    offsetY = Math.min(offsetY, rows - inset);
    offsetY = Math.max(offsetY, inset);

    let reds = 0; //total for all the red values in the 41x41 square
    let greens = 0;
    let blues = 0;
    for (let x = -1 * inset; x <= inset; x++) {
      for (let y = -1 * inset; y <= inset; y++) {
        let c = APP.getPixelColor(cols, offsetY + y, offsetX + x);
        reds += c.red;
        greens += c.green;
        blues += c.blue;
      }
    }
    let nums = 30 * 30; //total number of pixels in the box
    let red = Math.round(reds / nums);
    let green = Math.round(greens / nums);
    let blue = Math.round(blues / nums);
    let clr = `rgb(${red}, ${green}, ${blue})`;

    APP.ctx.fillStyle = clr;
    APP.ctx.strokeStyle = '#FFFFFF';
    APP.ctx.strokeWidth = 2;
    APP.average = clr;
    APP.ctx.strokeRect(offsetX - inset, offsetY - inset, 30, 30);
    APP.ctx.fillRect(offsetX - inset, offsetY - inset, 30, 30);
  },

  getPixelColor(cols, x, y) {
    let pixel = cols * x + y;
    let arrayPos = pixel * 4;
    return {
      red: APP.data[arrayPos],
      green: APP.data[arrayPos + 1],
      blue: APP.data[arrayPos + 2],
      alpha: APP.data[arrayPos + 3],
    };
  },
  addBox(ev) {
    let colors = document.querySelector('.colors');
    let pixel = document.createElement('span');
    pixel.className = 'box';
    pixel.setAttribute('data-label', 'Exact pixel');
    pixel.setAttribute('data-color', APP.pixel);

    let average = document.createElement('span');
    average.className = 'box';
    average.setAttribute('data-label', 'Average');
    average.setAttribute('data-color', APP.average);

    pixel.style.backgroundColor = APP.pixel;
    average.style.backgroundColor = APP.average;
    colors.append(pixel, average);
    // colors.append(pixel);
  
  },

  clearBox(ev) {

    let colors = document.querySelector('.colors');
    let pixel = document.querySelector('.box');

    colors.removeChild(pixel);

  },


  manipulate() {
    let selectedPixel = APP.ctx.getImageData(0,0, APP.canvas.width, APP.canvas.height)
    let pixel = document.getElementsByTagName('span')
    let pixelColor = APP.pixel;
    
    const scannedData = selectedPixel.data;
  
    // console.log(scannedData);
    for (let i = 0; i < scannedData.length; i += 4) {
      const total = scannedData[i] + scannedData[i+1] + scannedData[i+2];

   
        // document.querySelector(".hex").innerText = hexValue;
     
    //   // const averageColorValue = total / 3;
      scannedData[i] = red;
      scannedData[i + 1] = green;
      scannedData[i + 2] = blue;
      // console.log(red);
    }
    // scannedImage.data = scannedData;
    // APP.ctx.putImageData(scannedImage, 0, 0);
    }

    
  
}

  
document.addEventListener('DOMContentLoaded', APP.init);
// document.addEventListener('DOMContetLoaded', Graph.init);


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


  getSpectrumWrapper().addEventListener("click", (e) => {
    const rgb = findRgbFromMousePosition(e);
    const { r, g, b } = saturate(rgb, e);
    const hexValue = rgbToHex(r, g, b);
    document.querySelector(".red").innerText = r;
    document.querySelector(".green").innerText = g;
    document.querySelector(".blue").innerText = b;
    document.querySelector(".hex").innerText = hexValue;
    red = r;
    green = g;
    blue = b;
  });

  let red = 0;
  let green = 0;
  let blue = 0;

