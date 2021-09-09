// import getSpectrumWrapper from "./colorSpectrum.js";


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
    APP.img.manipulate();
  
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
    // colours.append(pixel, average);
    colors.append(pixel);
  
  },

  

  manipulate() {
    let selectedPixel = ctx.getImageData(0,0, this.canvas.width, this.canvas.height)
    // selectedPixel 
    getSpectrumWrapper().addEventListener("click", (e) => {
      const rgb = findRgbFromMousePosition(e);
      const { r, g, b } = saturate(rgb, e);
      const hexValue = rgbToHex(r, g, b);
      document.querySelector(".red").innerText = r;
      document.querySelector(".green").innerText = g;
      document.querySelector(".blue").innerText = b;
      document.querySelector(".hex").innerText = hexValue;
    });
    
  
    

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