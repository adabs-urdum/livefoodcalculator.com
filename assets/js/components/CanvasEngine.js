class CanvasEngine {
  constructor() {
    this.canvas = document.getElementById("result");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 4;
  }

  drawLine = (to) => {
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  };

  reset = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}

export default CanvasEngine;
