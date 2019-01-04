const UUIDS = {
  INFO: 0x180A,
  TEMPERATURE: 0x1809,
  BATTERY: 0x180F,
};

const mainLoopTimeout = 60000;
const buttonPressTimeout = 5000;
const buttonInitialValue = 0;
const buttonValueIncrement = 10;

// Our own copy of currrent advertising data
let currentAdvertising = {};

// Convenience helpers
const getBattery = () => Puck.getBatteryPercentage();
const getTemperature = () => Math.round(E.getTemperature()); // TODO Try removing rounding

// Overwrites advertising data and updates local copy
const setAdvertising = (data) => {
  currentAdvertising = data;
  NRF.setAdvertising(data);
  console.log('Advertising: ', data);
  LED2.set();
  setTimeout(() => {
    LED2.reset();
  }, 500);
};

// Updates advertising with passed values
const updateAdvertising = (data) => {
  const nextData = {
    ...currentAdvertising,
    ...data,
  };
  setAdvertising(nextData);
};

// Runs initial set up
const setUp = () => {
  // Initialize uuids
  const initialAdvertisingData = {
    [UUIDS.INFO]: [buttonInitialValue],
    [UUIDS.BATTERY]: [getBattery()],
    [UUIDS.TEMPERATURE]: [getTemperature()],
  };

  // Advertise data
  updateAdvertising(initialAdvertisingData);
};

// Updates battery and temperature
const loop = () => {
  const nextData = {
    [UUIDS.BATTERY]: [getBattery()],
    [UUIDS.TEMPERATURE]: [getTemperature()],
  };
  updateAdvertising(nextData);
};

// Would prefer this to be undefined, but puck complains if it is
let buttonTimeout = 0;
const buttonPress = () => {
  // Get current button value
  const buttonValue = Number(currentAdvertising[UUIDS.INFO]);

  // Increment button value and update
  const nextButtonValue = buttonValue + buttonValueIncrement;
  updateAdvertising({
    [UUIDS.INFO]: [nextButtonValue],
  });

  // If there's not a timeout running, then start one
  if (!buttonTimeout) {
    buttonTimeout = setTimeout(() => {
      // Reset button value to 0
      updateAdvertising({
        [UUIDS.INFO]: [buttonInitialValue],
      });
      // Clear timeout variable
      buttonTimeout = 0;
    }, buttonPressTimeout);
  }
};

setUp();

setInterval(loop, mainLoopTimeout);

setWatch(
  buttonPress,
  BTN,
  {
    edge: 'rising',
    debounce: 50,
    repeat: true,
  },
);
