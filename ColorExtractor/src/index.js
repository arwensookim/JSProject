
class App {
  constructor() {
    this.canvas= document.querySelector('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    this.isLoaded = false;
    this.imgPos = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.img = new Image();
    this.image.src = 'image/img1.png';
    this.image.onload = () => {
      this.isLoaded = true;
      this.drawImage();
    }
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pisxelRatio, this.pixelRaio);

    if(this.isLoaded) {
      this.drawImage();
    }
  }

    drawImage() {
      const StageRatio = this.stageWidth / this.stageHeight;
      const imgRaio = this.image.width / this.imgs.height;

      this.imsPos.width = this.stageWidth;
      this.imgPos.height = this.stageHeight;

      if(imgRaio > StageRatio) {
        this.imgPos.width = Math.round(
          this.image.width * (this.stageHeight / this.image.height)
        );
        this.imgPos.x = Math.round(
          (this.stageWidth - this.imgPos.width) / 2
        );
      } else {
        this.imgPos.height = Math.round(
          this.image.height * (this.stageWidth / this.image.width)
        );
        this.imgPos.y = Math.round(
          (this.stageHeight - this.imgPos.height) / 2
      
        );  
    }
      this.ctx.drawImage(
        this.image,
        0, 0,
        this.image.width, this.image.height,
        this.imsPos.x, this.imgPos.y,
        this.imgPos.width, this.imgPos.height,
      )
  }
};



window.onload = () => {
  new app();
};
