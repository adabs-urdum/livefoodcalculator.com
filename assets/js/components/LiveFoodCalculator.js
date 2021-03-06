import Species from "./Species";
import CanvasEngine from "./CanvasEngine";
import ColorGenerator from "./ColorGenerator";

class LiveFoodCalculator {
  constructor() {
    this.canvasEngine = new CanvasEngine();
    this.formSpecies = document.getElementById("formSpecies");
    this.species = [...document.getElementsByClassName("panel__species")];
    this.clearCanvasButton = document.getElementById("result__clearCanvas");
    this.buttonRunSimulation = document.getElementById("buttonRunSimulation");
    this.buttonRunSimulationMulti = document.getElementById(
      "buttonRunSimulationMulti"
    );
    this.resultReport = document.getElementById("resultReport");

    this.speciesObjects = [];
    this.allRuns = [];
    this.week = 0;
    this.colorGenerator = new ColorGenerator();
    this.weeksMax = parseInt(
      document.getElementById("formSpecies__timespan").value
    );
    this.renderCounter = 0;
    this.weeks = [];

    this.addEventListeners();

    const windowWidth = window.innerWidth;
    let initialRuns = 4;
    if (windowWidth > 1024) {
      initialRuns = 4;
    } else if (windowWidth > 768) {
      initialRuns = 3;
    } else if (windowWidth > 500) {
      initialRuns = 2;
    } else {
      initialRuns = 2;
    }
    for (let i = 0; i < initialRuns; i++) {
      this.onFormSpeciesSubmit();
    }
  }

  addEventListeners = () => {
    this.formSpecies.addEventListener("submit", this.onFormSpeciesSubmit);
    this.clearCanvasButton.addEventListener(
      "click",
      this.onClickClearCanvasButton
    );
    this.buttonRunSimulation.addEventListener(
      "click",
      this.onFormSpeciesSubmit
    );
    this.buttonRunSimulationMulti.addEventListener("click", (e) => {
      this.onFormSpeciesSubmit();
      this.onFormSpeciesSubmit();
      this.onFormSpeciesSubmit();
    });
    document
      .getElementById("formSpecies__timespan")
      .addEventListener("change", this.onClickClearCanvasButton);
  };

  onClickClearCanvasButton = () => {
    document.getElementById("result__report").innerHTML = "";
    this.allRuns = [];
    this.canvasEngine.reset();
  };

  runSimulation = () => {
    this.speciesObjects = [];

    this.species.forEach((speciesSingular) => {
      this.speciesObjects.push(
        new Species({
          formElement: speciesSingular,
          name: document.getElementById("formSpecies__species").value,
          transitionalTime: document.getElementById(
            "formSpecies__transitionalTime"
          ).value,
          wearingTime: document.getElementById("formSpecies__wearingTime")
            .value,
          litterSizeFrom: document.getElementById("formSpecies__litterSizeFrom")
            .value,
          litterSizeTo: document.getElementById("formSpecies__litterSizeTo")
            .value,
          sexualMaturity: document.getElementById("formSpecies__sexualMaturity")
            .value,
          lifeSpan: document.getElementById("formSpecies__lifeSpan").value,
          deathChance: document.getElementById("formSpecies__deathChance")
            .value,
          startPremature: document.getElementById("formSpecies__startPremature")
            .value,
          startMature: document.getElementById("formSpecies__startMature")
            .value,
          extractionStart: document.getElementById(
            "formSpecies__extractionStart"
          ).value,
          extractionPremature: document.getElementById(
            "formSpecies__extractionPremature"
          ).value,
          extractionMature: document.getElementById(
            "formSpecies__extractionMature"
          ).value,
        })
      );
    });

    this.speciesObjects.forEach((speciesObject) => {
      speciesObject.infoElement = document.getElementById("infoPanel__species");
      speciesObject.render();
    });

    this.simulateWeeks();
    this.renderCanvas();
    this.renderOverview();
    this.renderResultReport();
  };

  renderResultReport = () => {
    const elementWeeks = document.getElementById("resultText__weeks");
    const elementRounds = document.getElementById("resultText__rounds");
    const elementGrounded = document.getElementById("resultText__grounded");
    const elementMaxPopulation = document.getElementById(
      "resultText__maxPopulation"
    );
    const elementEndPopulation = document.getElementById(
      "resultText__remaining"
    );
    const elementFed = document.getElementById("resultText__fed");
    const elementOffspring = document.getElementById("resultText__offspring");
    const elementQuota = document.getElementById("resultText__quota");
    const elementDead = document.getElementById("resultText__dead");
    const elementMissingGender = document.getElementById(
      "resultText__missingGender"
    );
    const elementMissingOffspring = document.getElementById(
      "resultText__missingOffspring"
    );
    const elementFemales = document.getElementById("resultText__females");
    const elementFemalesAdult = document.getElementById(
      "resultText__femalesAdult"
    );
    const elementMales = document.getElementById("resultText__males");
    const elementMalesAdult = document.getElementById("resultText__malesAdult");

    elementRounds.innerText = this.allRuns.length;

    let breeds = 0;
    let weeksAll = 0;
    let maxPopulation = 0;
    let endPopulation = 0;
    let endPopulationMale = 0;
    let endPopulationMaleMature = 0;
    let endPopulationFemale = 0;
    let endPopulationFemaleMature = 0;
    let deadAverage = 0;
    let missingGender = 0;
    let grounded = 0;
    let fed = 0;

    this.allRuns.forEach((run, runKey) => {
      run.forEach((speciesObject, speciesObjectKey) => {
        weeksAll += speciesObject[0].endWeek
          ? speciesObject[0].endWeek
          : this.week;

        if (speciesObjectKey == run.length - 1) {
          endPopulation += speciesObject[0].population.length;
          endPopulationMale += speciesObject[0].population.filter(
            (individual) => !individual.isFemale
          ).length;
          endPopulationMaleMature += speciesObject[0].population.filter(
            (individual) => !individual.isFemale && individual.isMature
          ).length;
          endPopulationFemale += speciesObject[0].population.filter(
            (individual) => individual.isFemale
          ).length;
          endPopulationFemaleMature += speciesObject[0].population.filter(
            (individual) => individual.isFemale && individual.isMature
          ).length;

          breeds += parseInt(speciesObject[0].breeds);
          deadAverage += speciesObject[0].dead;
          missingGender += speciesObject[0].missingGender;
          fed += speciesObject[0].fed;

          if (!speciesObject[0].population.length) {
            grounded += 1;
          }
        }
        maxPopulation =
          maxPopulation < speciesObject[0].maxPopulation
            ? speciesObject[0].maxPopulation
            : maxPopulation;
      });
    });

    const weeksAverage = Math.round(
      weeksAll / (this.weeks.length * this.allRuns.length)
    );
    elementWeeks.innerText = weeksAverage;
    elementMaxPopulation.innerText = maxPopulation;
    elementDead.innerText = Math.round(deadAverage / this.allRuns.length);
    elementOffspring.innerText = Math.round(breeds / this.allRuns.length);
    elementMissingOffspring.innerText = Math.round(
      missingGender / this.allRuns.length
    );
    elementMissingGender.innerText = Math.round(
      missingGender / this.allRuns.length
    );
    elementGrounded.innerText = grounded;
    elementFed.innerText = Math.round(fed / this.allRuns.length);
    elementEndPopulation.innerText = Math.round(
      endPopulation / this.allRuns.length
    );
    elementFemales.innerText = Math.round(
      endPopulationFemale / this.allRuns.length
    );
    elementFemalesAdult.innerText = Math.round(
      endPopulationFemaleMature / this.allRuns.length
    );
    elementMales.innerText = Math.round(
      endPopulationMale / this.allRuns.length
    );
    elementMalesAdult.innerText = Math.round(
      endPopulationMaleMature / this.allRuns.length
    );

    elementQuota.innerText =
      100 - Math.round((100 / this.allRuns.length) * grounded);
  };

  simulateWeeks = () => {
    while (this.weeksMax > this.week) {
      this.week += 1;

      this.speciesObjects.filter((speciesObject) => {
        if (speciesObject.population.length <= 0 && !speciesObject.endWeek) {
          speciesObject.endWeek = this.week;
        }
        if (
          speciesObject.population.length > 1500 ||
          speciesObject.population.length <= 0
        ) {
          return true;
        }

        const males = speciesObject.getMales(true).length;
        const females = speciesObject.getFemales(true).length;

        speciesObject.population.forEach((individual, individualKey) => {
          individual.ageOneWeek();
          individual.checkIfMature(speciesObject.sexualMaturity);
          individual.checkIfDead(
            speciesObject.lifeSpan,
            speciesObject.deathChance
          );

          if (individual.isDead) {
            return;
          }

          if (
            !speciesObject.endWeek &&
            speciesObject.population.length &&
            males &&
            females
          ) {
            const newYounglings = individual.checkPregnancy(
              speciesObject.wearingTime,
              speciesObject.transitionalTime
            );

            if (newYounglings) {
              const amount =
                speciesObject.litterSizeFrom +
                Math.round(
                  Math.random(
                    speciesObject.litterSizeTo - speciesObject.litterSizeFrom
                  )
                );
              speciesObject.addToPopulation(amount, false, 0);
            }
          }
        });

        if (!males || !females) {
          speciesObject.missingGender += 1;
        }

        if (
          (speciesObject.extractionMature ||
            speciesObject.extractionPremature) &&
          this.week > speciesObject.extractionStart &&
          speciesObject.population.length
        ) {
          function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
          }

          let matures = speciesObject.population.filter(
            (individual) => individual.isMature
          );
          shuffleArray(matures);

          let prematures = speciesObject.population.filter(
            (individual) => !individual.isMature
          );
          shuffleArray(prematures);

          if (speciesObject.extractionMature > matures.length) {
            speciesObject.missingOffspring += 1;
            speciesObject.fed += matures.length;
          } else {
            speciesObject.fed += speciesObject.extractionMature;
          }

          matures = matures.slice(speciesObject.extractionMature);

          if (speciesObject.extractionPremature > prematures.length) {
            speciesObject.missingOffspring += 1;
            speciesObject.fed += prematures.length;
          } else {
            speciesObject.fed += speciesObject.extractionPremature;
          }

          prematures = prematures.slice(speciesObject.extractionPremature);

          speciesObject.population = [].concat(matures).concat(prematures);
        }

        speciesObject.dead += speciesObject.population.filter(
          (individual) => individual.isDead
        ).length;
        speciesObject.population = speciesObject.population.filter(
          (individual) => !individual.isDead
        );

        speciesObject.maxPopulation =
          speciesObject.population.length > speciesObject.maxPopulation
            ? speciesObject.population.length
            : speciesObject.maxPopulation;

        return speciesObject.population.length ? true : false;
      });

      this.weeks.push(JSON.parse(JSON.stringify(this.speciesObjects)));
    }

    this.allRuns.push(this.weeks);
  };

  renderCanvas = () => {
    const canvasWidth = this.canvasEngine.canvas.width;
    const canvasHeight = this.canvasEngine.canvas.height;
    const maxPopulations = [];
    this.weeks.forEach((week) => {
      week.forEach((speciesObject, speciesObjectKey) => {
        maxPopulations[speciesObjectKey] = speciesObject.maxPopulation;
      });
    });

    this.canvasEngine.ctx.lineWidth = 8;
    this.canvasEngine.ctx.beginPath();
    this.canvasEngine.ctx.strokeStyle = this.colorGenerator.rgbToHex(
      this.colorGenerator.colors[this.colorGenerator.currentColorKey]
    );
    this.colorGenerator.currentColorKey = Math.round(
      Math.random() * this.colorGenerator.colors.length
    );

    this.canvasEngine.ctx.moveTo(0, canvasHeight);

    this.weeks.forEach((week, weekKey) => {
      const weekNumber = weekKey + 1;

      week.forEach((speciesObject, speciesObjectKey) => {
        const steps = {
          x: canvasWidth / this.weeks.length,
          y: canvasHeight,
        };

        this.canvasEngine.drawLine({
          x: steps.x * weekNumber,
          y:
            canvasHeight -
            (canvasHeight / 500) * speciesObject.population.length,
        });
      });
    });
  };

  renderOverview = () => {
    const lastWeek = this.weeks[this.weeks.length - 1];

    const wrapper = document.createElement("div");
    wrapper.classList.add("result__weekWrapper");

    lastWeek.forEach((speciesObject) => {
      const reportEntry = document.createElement("div");
      reportEntry.classList.add("result__reportEntry");

      reportEntry.style.borderTopColor = this.canvasEngine.ctx.strokeStyle;

      const females = speciesObject.population.filter(
        (individual) => individual.isFemale
      );
      const adultFemales = females.filter((individual) => individual.isMature);

      const males = speciesObject.population.filter(
        (individual) => !individual.isFemale
      );
      const adultMales = males.filter((individual) => individual.isMature);

      const endWeek = speciesObject.endWeek
        ? speciesObject.endWeek
        : this.weeks.length;

      reportEntry.innerHTML = `
            <p class="result__reportRow result__reportRow--weeks ${
              endWeek < this.weeks.length ? "result__reportRow--bad" : ""
            }">
              <span>Wochen:</span> ${endWeek}</p>
            <p class="result__reportRow result__reportRow--population ${
              speciesObject.population.length <
              speciesObject.startMature + speciesObject.startPremature
                ? "result__reportRow--bad"
                : ""
            }"><span>Population:</span> ${speciesObject.population.length}</p>
            <p class="result__reportRow"><span>Max. Population:</span> ${
              speciesObject.maxPopulation
            }</p>
            <p class="result__reportRow">
              <span>Weibchen:</span> ${females.length}</p>
            <p class="result__reportRow">
              <span>davon erwachsen:</span> ${adultFemales.length}</p>
            <p class="result__reportRow">
              <span>Männchen:</span> ${males.length}</p>
            <p class="result__reportRow">
              <span>davon erwachsen:</span> ${adultMales.length}</p>
            <p class="result__reportRow">
              <span>Unerwartet verendet:</span> ${speciesObject.dead}</p>
            <p class="result__reportRow">
              <span>Nachzuchten:</span> ${speciesObject.breeds}</p>
            <p class="result__reportRow ${
              speciesObject.missingGender > this.weeks.length / 10
                ? "result__reportRow--bad"
                : ""
            }">
              <span>Wochen mit zu wenig geschlechtsreifen Tieren:</span> ${
                speciesObject.missingGender
              }</p>
            <p class="result__reportRow ${
              speciesObject.missingOffspring > this.weeks.length / 10
                ? "result__reportRow--bad"
                : ""
            }">
              <span>Wochen mit weniger Ertrag, als zur Verfütterung gebraucht:</span> ${
                speciesObject.missingOffspring
              }</p>
            <p class="result__reportRow">
              <span>Verfüttert:</span> ${speciesObject.fed}</p>
          `;
      wrapper.appendChild(reportEntry);
    });

    document.getElementById("result__report").appendChild(wrapper);
  };

  onFormSpeciesSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.weeksMax = parseInt(
      document.getElementById("formSpecies__timespan").value
    );
    this.week = 0;
    this.weeks = [];
    this.runSimulation();
    this.renderCounter += 1;
  };
}

export default LiveFoodCalculator;
