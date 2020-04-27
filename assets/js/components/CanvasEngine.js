class CanvasEngine {
  constructor() {
    this.canvas = document.getElementById("result");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(1, 1);

    this.addEventListeners();

    this.setCanvasSize();
  }

  addEventListeners = () => {
    // window.addEventListener("resize", this.setCanvasSize);
  };

  setCanvasSize = () => {
    const main = document.getElementsByTagName("main")[0];
    const mainInnerWidth =
      main.getBoundingClientRect().width -
      parseFloat(window.getComputedStyle(main).padding) * 2;
    const ratio = this.canvas.height / this.canvas.width;

    console.log(mainInnerWidth);

    this.canvas.width = mainInnerWidth * 2;
    this.canvas.height = mainInnerWidth * 2 * ratio;
    this.ctx.scale(1, 1);
  };

  drawLine = (to) => {
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  };

  reset = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}

export default CanvasEngine;
