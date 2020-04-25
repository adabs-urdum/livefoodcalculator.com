class Individual {
  constructor(setup) {
    this.age = setup.age ? parseInt(setup.age) : 0;
    this.isMature = setup.isMature ? true : false;
    this.isFemale = Math.round(Math.random());
    this.isPregnant =
      this.isFemale && this.isMature ? Math.round(Math.random()) : 0;
    this.progressPregnancy = 0;
    this.progressTransitionalTime = 0;
    this.isDead = false;
  }

  ageOneWeek = () => {
    this.age += 1;
  };

  checkIfMature = (sexualMaturity) => {
    if (this.isMature != true && this.age >= sexualMaturity) {
      this.isMature = true;
    }
  };

  checkIfDead = (lifeSpan, deathChance) => {
    if (this.age > lifeSpan) {
      if (Math.round(Math.random())) {
        this.isDead = true;
      }
    }

    if (Math.round(Math.random() * 100) < deathChance) {
      this.isDead = true;
    }
  };

  checkPregnancy = (wearingTime, transitionalTime) => {
    if (this.isFemale && this.isMature) {
      if (this.isPregnant) {
        this.progressPregnancy += 1;
        if (this.progressPregnancy >= wearingTime) {
          this.progressPregnancy = 0;
          this.isPregnant = false;
          return true;
        }
      } else {
        if (
          this.progressTransitionalTime >= transitionalTime &&
          Math.random() > 0.4
        ) {
          this.isPregnant = true;
          this.progressTransitionalTime = 0;
        } else {
          this.progressTransitionalTime += 1;
        }
      }
    }

    return false;
  };
}

export default Individual;
