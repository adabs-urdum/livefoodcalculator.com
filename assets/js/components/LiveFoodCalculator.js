import Species from "./Species";
import CanvasEngine from "./CanvasEngine";

class LiveFoodCalculator {
  constructor() {
    this.canvasEngine = new CanvasEngine();
    this.formSpecies = document.getElementById("formSpecies");
    this.species = [...document.getElementsByClassName("panel__species")];
    this.clearCanvasButton = document.getElementById("result__clearCanvas");
    this.speciesObjects = [];
    this.week = 0;
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
  };

  onClickClearCanvasButton = () => {
    document.getElementById("result__report").innerHTML = "";
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
          litterSize: document.getElementById("formSpecies__litterSize").value,
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
              speciesObject.addToPopulation(speciesObject.litterSize, false, 0);
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
          // for (let i = 0; i < speciesObject.extractionMature; i++) {
          //   const randomKey = Math.round(Math.random() * matures.length);
          //   matures = mature.slice(randomKey, randomKey + 1);
          // }

          if (speciesObject.extractionPremature > prematures.length) {
            speciesObject.missingOffspring += 1;
            speciesObject.fed += prematures.length;
          } else {
            speciesObject.fed += speciesObject.extractionPremature;
          }

          prematures = prematures.slice(speciesObject.extractionPremature);
          // for (let i = 0; i < speciesObject.extractionPremature; i++) {
          //   const randomKey = Math.round(Math.random() * prematures.length);
          //   prematures = prematures.slice(randomKey, randomKey + 1);
          // }

          speciesObject.population = [].concat(matures).concat(prematures);
        }

        speciesObject.dead += speciesObject.population.filter(
          (individual) => individual.isDead
        ).length;
        speciesObject.population = speciesObject.population.filter(
          (individual) => !individual.isDead
        );

        return speciesObject.population.length ? true : false;
      });

      this.weeks.push(JSON.parse(JSON.stringify(this.speciesObjects)));
    }
  };

  renderCanvas = () => {
    const canvasWidth = this.canvasEngine.canvas.width;
    const canvasHeight = this.canvasEngine.canvas.height;
    const maxPopulations = [];
    this.weeks.forEach((week) => {
      week.forEach((speciesObject, speciesObjectKey) => {
        if (speciesObjectKey in maxPopulations) {
          if (
            maxPopulations[speciesObjectKey] > speciesObject.population.length
          ) {
            return;
          }
        }
        maxPopulations[speciesObjectKey] = speciesObject.population.length;
      });
    });

    this.canvasEngine.ctx.beginPath();

    this.canvasEngine.ctx.strokeStyle =
      "#" + (((1 << 24) * Math.random()) | 0).toString(16);
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
            (canvasHeight / maxPopulations[speciesObjectKey]) *
              speciesObject.population.length,
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
              <span>Wochen mit zu wenig Futtertieren:</span> ${
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
