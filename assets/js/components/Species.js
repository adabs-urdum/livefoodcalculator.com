import Individual from "./Individual";

class Species {
  constructor(setup) {
    this.population = [];
    this.dead = 0;
    this.formElement = setup.formElement;
    this.startMature = parseInt(setup.startMature);
    this.startPremature = parseInt(setup.startPremature);
    this.missingGender = 0;
    this.missingOffspring = 0;
    this.fed = 0;
    this.endWeek = null;
    this.extractionStart = setup.extractionStart
      ? parseInt(setup.extractionStart)
      : 0;
    this.deathChance = setup.deathChance ? parseInt(setup.deathChance) : 2;
    this.extractionMature = parseInt(setup.extractionMature);
    this.extractionPremature = parseInt(setup.extractionPremature);
    this.name = setup.name ? setup.name : "Sppezies";
    this.transitionalTime = setup.transitionalTime
      ? parseInt(setup.transitionalTime)
      : 0;
    this.wearingTime = setup.wearingTime ? parseInt(setup.wearingTime) : 0;
    this.litterSize = setup.litterSize ? parseInt(setup.litterSize) : 0;
    this.sexualMaturity = setup.sexualMaturity
      ? parseInt(setup.sexualMaturity)
      : 0;
    this.lifeSpan = setup.lifeSpan ? parseInt(setup.lifeSpan) : 0;

    this.maxCycles = this.getRoundedNumber(
      (this.lifeSpan - this.sexualMaturity) /
        (this.wearingTime + this.transitionalTime),
      1
    );

    this.maxYoungsters = this.getRoundedNumber(
      this.maxCycles * this.litterSize,
      0
    );

    this.addToPopulation(this.startMature, true);
    this.addToPopulation(this.startPremature, false);

    this.breeds = 0;
  }

  addToPopulation = (amount, mature, age) => {
    for (let index = 0; index < amount; index++) {
      let currentAge = age >= 0 ? age : -1;
      if (currentAge == -1) {
        if (mature) {
          currentAge = Math.round(
            Math.random() * (this.lifeSpan - this.sexualMaturity) +
              this.sexualMaturity
          );
        } else {
          currentAge = Math.round(Math.random() * this.sexualMaturity);
        }
      }

      this.population.push(
        new Individual({
          age: currentAge,
          isMature: mature,
        })
      );

      this.breeds += 1;
    }
  };

  getRoundedNumber = (input, decimals) => {
    return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  getMales = (adult) => {
    if (adult) {
      return this.population.filter(
        (individual) => !individual.isFemale && individual.isMature
      );
    } else {
      return this.population.filter((individual) => !individual.isFemale);
    }
  };

  getFemales = (adult) => {
    if (adult) {
      return this.population.filter(
        (individual) => individual.isFemale && individual.isMature
      );
    } else {
      return this.population.filter((individual) => individual.isFemale);
    }
  };

  render = () => {
    this.infoElement.getElementsByClassName(
      "infoPanel__rowResult--maxCycles"
    )[0].innerText = this.maxCycles;

    this.infoElement.getElementsByClassName(
      "infoPanel__rowResult--maxYoungsters"
    )[0].innerText = this.maxYoungsters;
  };
}

export default Species;
