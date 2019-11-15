const piPins = require('pi-pins')

const kettlePower = piPins.connect(17);
const kettlePowerLED = piPins.connect(23);
const kettleHold = piPins.connect(27);

const wasteWater = piPins.connect(5)
const washWater = piPins.connect(6)

kettlePower.mode('low');
kettlePowerLED.mode('in');
kettleHold.mode('low');

wasteWater.mode('in');
washWater.mode('in');



module.exports = {
    pins: {
        'kettlePower': kettlePower,
        'kettlePowerLED': kettlePowerLED,
        'kettleHold': kettlePower,
        'wasteWater': wasteWater,
        'washWater': washWater,
    },
    kettlePowerHold: async () => {
        await module.exports.kettlePowerToggle();
        setTimeout(() => module.exports.kettleHoldToggle(), 2000)
    },
    kettlePowerToggle: async () => {
        return new Promise((res, rej) => {
            kettlePower.value(true);
            setTimeout(() => { 
                kettlePower.value(false);
                res()
            }, 1000)
        })
    },
    kettleHoldToggle: async () => {
        kettleHold.value(true);
        setTimeout(() => kettleHold.value(false), 1000)
    },
    on: (pinKey, callback) => {
        let pin =  module.exports.pins[pinKey]
        pin.on('both', () => callback(pin.value()))
    },
    onKettlePower: (callback) => {
        kettlePowerLED.on('rise', () => callback(true, new DateTime()));
        kettlePowerLED.on('fall', () => callback(false, null));
    }
}