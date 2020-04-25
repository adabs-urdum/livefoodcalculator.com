"use strict";

import "babel-polyfill";
import LiveFoodCalculator from "./components/LiveFoodCalculator";

Array.prototype.getRandomValue = (inputArray) => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function () {
  const testInstance = new LiveFoodCalculator();
});
