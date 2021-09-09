// import {getSpectrumWrapper} from "./colorSpectrum.js";


const APP = {
  canvas: null,
  ctx: null,
  data: [],
  img: null,
  init() {
    APP.canvas = document.querySelector('main canvas');
    APP.ctx = APP.canvas.getContext('2d');
    APP.canvas.width = 1000;
    APP.canvas.style.width = 1000;
    APP.canvas.height = 600;
    APP.canvas.style.height = 600;
    APP.img = document.createElement('img');
    APP.img.id = 'imagePreview';
    APP.img.src = APP.canvas.getAttribute('data-src');
    // console.log(APP.img);
    // APP.ctx.drawImage(APP.img, 0, 0, APP.img.width * .3, APP.img.height * .3);
    // APP.img.style.height = "500px";
    // APP.img.style.width = "900px";
    APP.img.style.objectFit = "contain";
    // once the image is loaded, add it to the canvas
    APP.img.onload = (ev) => {
      APP.ctx.drawImage(APP.img, 0, 0, APP.canvas.width, APP.canvas.height);
      //call the context.getImageData method to get the array of [r,g,b,a] values
      let imgDataObj = APP.ctx.getImageData(
        0,
        0,
        APP.canvas.width,
        APP.canvas.height
      );
      APP.data = imgDataObj.data; //data prop is an array
      // APP.addBox(e)
      // console.log(APP.data.length, 900 * 600 * 4); //  has 2,160,000 elements
      APP.canvas.addEventListener('mousemove', APP.getPixel);
      APP.canvas.addEventListener('click', APP.addBox);
    };
    APP.canvas.addEventListener('click', APP.manipulate)
   
  
  },
  getPixel(ev) {
    // APP.ctx.drawImage(APP.img, 0, 0, APP.img.width * .3, APP.img.height * .3);
    // let canvas = ev.target;
    let cols = APP.canvas.width;
    // let rows = canvas.height;
    let { offsetX, offsetY } = ev;
    //call the method to get the r,g,b,a values for current pixel
    let c = APP.getPixelColor(cols, offsetY, offsetX);
    //build a colour string for css
    let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`; //${c.alpha / 255}
    // document.getElementById('pixelColor').style.backgroundColor = clr;
    //save the string to use elsewhere
    APP.pixel = clr;
    //now get the average of the surrounding pixel colours
    APP.getAverage(ev);
  },
  getAverage(ev) {

    //replace everything in the canvas with the original image
    // let canvas = ev.target;
    let cols = APP.canvas.width;
    let rows = APP.canvas.height;
    //remove the current contents of the canvas to draw the image and box again
    APP.ctx.clearRect(0, 0, cols, rows);
    //add the image from memory
    // APP.ctx.drawImage(APP.img, 0, 0);
    APP.ctx.drawImage(APP.img, 0, 0, APP.canvas.width, APP.canvas.height);
    let { offsetX, offsetY } = ev;
    const inset = 20;
    //inset by 20px as our workable range
    offsetX = Math.min(offsetX, cols - inset);
    offsetX = Math.max(inset, offsetX);
    offsetY = Math.min(offsetY, rows - inset);
    offsetY = Math.max(offsetY, inset);

    let reds = 0; //total for all the red values in the 41x41 square
    let greens = 0;
    let blues = 0;
    //for anything in the range (x-20, y-20) to (x+20, y+20)
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
    //create a colour string for the average colour
    let clr = `rgb(${red}, ${green}, ${blue})`;
    //now draw an overlaying square of that colour
    //make the square twice as big as the sample area
    APP.ctx.fillStyle = clr;
    APP.ctx.strokeStyle = '#FFFFFF';
    APP.ctx.strokeWidth = 2;
    //save the average colour for later
    APP.average = clr;
    APP.ctx.strokeRect(offsetX - inset, offsetY - inset, 30, 30);
    APP.ctx.fillRect(offsetX - inset, offsetY - inset, 30, 30);
  },
  getPixelColor(cols, x, y) {
    //see grid.html as reference for this algorithm
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
    //user clicked. Let's add boxes below with the pixel and the average
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

  // const img = document.getElementById('imagePreview')
  // const chooseFile = document.getElementById('filename');
  //  chooseFile.addEventListener('click', ()=> {
  //   const boxes = document.querySelectorAll('.box');
  //   console.log(boxes);
  //   boxes.forEach((box) => {
  //     box.remove();
  //   })
  // });


  

  
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
    red = r;
    green = g;
    blue = b;
  });

  let red = 0;
  let green = 0;
  let blue = 0;