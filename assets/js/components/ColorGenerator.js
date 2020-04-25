class ColorGenerator {
  constructor() {
    this.colorSet = [
      "#ffb700",
      "c68e00",
      "0dcdff",
      "1291b3",
      "aa14cc",
      "65067a",
    ];
    this.currentColorKey = 0;

    while (!this.currentColor) {
      this.currentColor = this.colorSet[
        Math.round(Math.random() * this.colorSet.length)
      ];
    }

    this.colors = this.getColorShades(this.colorSet, true);
  }

  hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const red = parseInt(result[1], 16);
    const green = parseInt(result[2], 16);
    const blue = parseInt(result[3], 16);
    const rgb = {
      r: red,
      g: green,
      b: blue,
    };
    return result ? rgb : null;
  };

  rgbToHex = (rgb) => {
    const r = rgb ? rgb.r : Math.round(Math.random() * 255);
    const g = rgb ? rgb.g : Math.round(Math.random() * 255);
    const b = rgb ? rgb.b : Math.round(Math.random() * 255);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  getColorShades = (colorSet, isHex) => {
    const result = [];

    colorSet.forEach((color) => {
      let rgb = color;

      if (isHex) {
        rgb = this.hexToRgb(color);
      }

      let step = 33;

      for (let i = 0; i < 10; i++) {
        rgb.r += step;
        rgb.g += step;
        rgb.b += step;
        if (
          rgb.r < 256 &&
          rgb.g < 256 &&
          rgb.b < 256 &&
          rgb.r > 0 &&
          rgb.g > 0 &&
          rgb.b > 0
        ) {
          const newRgb = JSON.parse(JSON.stringify(rgb));
          if (!result.includes(newRgb)) {
            result.push(newRgb);
          }
        } else {
          step *= -1;
          rgb.r += step;
          rgb.g += step;
          rgb.b += step;
        }
      }
    });
    return result;
  };
}

export default ColorGenerator;
