<?php
  $presets = [
    [
      'name' => 'Caridina pareparensis',
      'transitionalTime' => 3,
      'wearingTime' => 4,
      'litterSize' => 15,
      'sexualMaturity' => 12,
      'lifeSpan' => 72,
      'deathChance' => 2,
    ],
    [
      'name' => 'Neocaridina davidi',
      'transitionalTime' => 3,
      'wearingTime' => 4,
      'litterSize' => 15,
      'sexualMaturity' => 12,
      'lifeSpan' => 72,
      'deathChance' => 2,
    ],
    [
      'name' => 'Blasenschnecken',
      'transitionalTime' => 0,
      'wearingTime' => 1,
      'litterSize' => 15,
      'sexualMaturity' => 6,
      'lifeSpan' => 16,
      'deathChance' => 1,
    ],
    [
      'name' => 'Posthornschnecken',
      'transitionalTime' => 1,
      'wearingTime' => 1,
      'litterSize' => 10,
      'sexualMaturity' => 6,
      'lifeSpan' => 72,
      'deathChance' => 1,
    ],
    [
      'name' => 'Asolene spixi',
      'transitionalTime' => 2,
      'wearingTime' => 4,
      'litterSize' => 10,
      'sexualMaturity' => 24,
      'lifeSpan' => 52,
      'deathChance' => 2,
    ],
    [
      'name' => 'Guppy',
      'transitionalTime' => 4,
      'wearingTime' => 4,
      'litterSize' => 10,
      'sexualMaturity' => 12,
      'lifeSpan' => 52,
      'deathChance' => 1,
    ],
  ];
  $presetKey = array_key_exists('preset', $_GET) ? intVal($_GET['preset']) : 0;
?>

<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>Aquarium-Lebendfutter-Zucht-Populations-Simulator</title>
  </head>
  <link rel="stylesheet" href="./dist/css/styles.min.css" />
  <body>
    <main>
      <header class="header">
        <div class="header__nav">
          <a class="button header__navLink" target="_blank" rel="noopener" href="https://cyrill-lehmann.ch">cyrill-lehmann.ch</a>
        </div>
        <h1>Aquarium-Lebendfutter-Zucht-Populations-Simulator</h1>
      </header>
      <section class="intro">
        <div class="intro__text">
          <p>
            Dieser Rechner ist wissenschaftlich nicht haltbar. Ich bin weder Mathematiker noch Ichthyologe. Mit mehreren Simulationen kann man möglicherweise grobe Tendenzen erkennen, aber es werden dabei keine realen oder zuverlässige Zahlen errechnet. Dem Prozessor zuliebe werden Simulationen ab einer Population von 1500 abgebrochen.
          </p>
        </div>
      </section>
      <section class="presets">
        <h3>Presets</h3>
        <ul class="presets__linkList">
          <?php foreach($presets as $key => $value): ?>
            <?php
              $activeClass = $key === $presetKey ? 'active' : null;
            ?>
            <li class="presets__linkListEntry">
              <a href="/?preset=<?= $key ?>" class="button presets__link <?= $activeClass ?>"><?= $value['name'] ?></a>
            </li>
          <?php endforeach; ?>
        </ul>
      </section>
      <section class="panel">
        <form class="panel__form" id="formSpecies">
          <div class="panel__species panel__row">
            <div class="panel__formRow">
              <h3 class="panel__title">Spezies</h3>
              <p class="panel__description">Details zur Tierart</p>
              <label class="panel__label" for="form__species">
                <span class="panel__labelText">Name</span>
                <input
                  id="formSpecies__species"
                  class="panel__formInput"
                  type="text"
                  value="<?= $presets[$presetKey]['name'] ?>"
                  name="species"
                />
              </label>
              <label class="panel__label" for="form__transitionalTime">
                <span class="panel__labelText">Ruhe-/Balz-/Paarungszeit</span>
                <input
                  id="formSpecies__transitionalTime"
                  class="panel__formInput"
                  type="number"
                  value="<?= $presets[$presetKey]['transitionalTime'] ?>"
                  name="transitionalTime"
                />
                <span class="panel__unit">Wochen</span>
              </label>
              <label class="panel__label" for="form__wearingTime">
                <span class="panel__labelText">Tragezeit</span>
                <input
                  id="formSpecies__wearingTime"
                  class="panel__formInput"
                  type="number"
                  value="<?= $presets[$presetKey]['wearingTime'] ?>"
                  name="wearingTime"
                />
                <span class="panel__unit">Wochen</span>
              </label>
              <label class="panel__label" for="form__litterSize">
                <span class="panel__labelText">Wurfgrösse/Gelegegrösse</span>
                <input
                  id="formSpecies__litterSize"
                  class="panel__formInput"
                  type="number"
                  value="<?= $presets[$presetKey]['litterSize'] ?>"
                  name="litterSize"
                />
              </label>
              <label class="panel__label" for="form__sexualMaturity">
                <span class="panel__labelText">Geschlechtsreif in</span>
                <input
                  id="formSpecies__sexualMaturity"
                  class="panel__formInput"
                  type="number"
                  value="<?= $presets[$presetKey]['sexualMaturity'] ?>"
                  name="sexualMaturity"
                />
                <span class="panel__unit">Wochen</span>
              </label>
              <label class="panel__label" for="form__lifeSpan">
                <span class="panel__labelText">Lebenserwartung</span>
                <input
                  id="formSpecies__lifeSpan"
                  class="panel__formInput"
                  type="number"
                  value="<?= $presets[$presetKey]['lifeSpan'] ?>"
                  name="lifeSpan"
                />
                <span class="panel__unit">Wochen</span>
              </label>
            </div>
            <div class="panel__formRow">
              <h3 class="panel__title">Startbesatz</h3>
              <p class="panel__description">Alter und Geschlecht werden zufällig bestimmt</p>
              <label class="panel__label" for="formSpecies__startPremature">
                <input
                  id="formSpecies__startPremature"
                  class="panel__formInput"
                  type="number"
                  value="28"
                  name="startPremature"
                />
                <span class="panel__unit">Jungtiere</span>
              </label>
              <label class="panel__label" for="formSpecies__startMature">
                <input
                  id="formSpecies__startMature"
                  class="panel__formInput"
                  type="number"
                  value="2"
                  name="startMature"
                />
                <span class="panel__unit">Adulte Tiere</span>
              </label>
            </div>
            <div class="panel__formRow">
              <h3 class="panel__title">Entnahme</h3>
              <p class="panel__description">Vorlaufzeit bis zur ersten Ernte</p>
              <label class="panel__label" for="formSpecies__extractionStart">
                <input
                  id="formSpecies__extractionStart"
                  class="panel__formInput"
                  type="number"
                  value="8"
                  name="extractionStart"
                />
                <span class="panel__unit">Wochen Vorlaufzeit</span>
              </label>
              <label
                class="panel__label"
                for="formSpecies__extractionPremature"
              >
                <input
                  id="formSpecies__extractionPremature"
                  class="panel__formInput"
                  type="number"
                  value="28"
                  name="extractionPremature"
                />
                <span class="panel__unit">Jungtiere pro Woche</span>
              </label>
              <label class="panel__label" for="formSpecies__extractionMature">
                <input
                  id="formSpecies__extractionMature"
                  class="panel__formInput"
                  type="number"
                  value="0"
                  name="extractionMature"
                />
                <span class="panel__unit">adulte Tiere pro Woche</span>
              </label>
            </div>
          </div>
          <label class="panel__label" for="form__deathChance">
            <span class="">Wahrscheinlichkeit eines vorzeitigen Todes (Unfall, Krankheit, gefressen usw.) jede Woche</span>
            <input
              id="formSpecies__deathChance"
              class="panel__formInput"
              type="number"
              value="<?= $presets[$presetKey]['deathChance'] ?>"
              name="deathChance"
            />
            <span class="panel__unit">%</span>
          </label>
          <label class="panel__label panel__row" for="formSpecies__timespan">
            <span class="panel__unit">Berechne einen Zeitraum von</span>
            <input
              id="formSpecies__timespan"
              class="panel__formInput"
              type="number"
              value="52"
              name="timespan"
            />
            Wochen
          </label>
          <div>
            <input type="submit" class="button panel__row" value="simulieren" />
          </div>
        </form>
      </section>
      <section class="infoPanel">
        <h3 class="infoPanel__title">Info</h3>
        <div class="infoPanel__species" id="infoPanel__species">
          <div class="infoPanel__row">
            <span class="infoPanel__rowTitle">Max.</span
            ><span
              class="infoPanel__rowResult infoPanel__rowResult--maxCycles"
            ></span>
            Vermehrungszyklen pro Weibchen
          </div>
          <div class="infoPanel__row">
            <span class="infoPanel__rowTitle">Max.</span
            ><span
              class="infoPanel__rowResult infoPanel__rowResult--maxYoungsters"
            ></span>
            Nachwuchs pro Weibchen
          </div>
        </div>
      </section>
      <section class="result">
        <h3>Populationskurve</h3>
        <span id="result__clearCanvas" class="result__clearCanvas button">leeren</span>
        <canvas
          id="result"
          class="result__canvas"
          width="1600"
          height="500"
        ></canvas>
        <div id="result__report" class="result__report"></div>
      </section>
    </main>
    <script src="./dist/js/functions.min.js"></script>
  </body>
</html>
