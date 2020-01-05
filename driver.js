const piPins = require('pi-pins')

const kettlePower = piPins.connect(17);
const kettlePowerLED = piPins.connect(23);
const kettleHold = piPins.connect(27);

const beanLight = piPins.connect(22);
const wasteWater = piPins.connect(5)
const washWater = piPins.connect(6)

kettlePower.mode('low');
kettlePowerLED.mode('in');
kettleHold.mode('low');

beanLight.mode('low');
wasteWater.mode('in');
washWater.mode('in');

let warningInterval;

module.exports = {
    pins: {
        'kettlePower': kettlePower,
        'kettlePowerLED': kettlePowerLED,
        'kettleHold': kettlePower,
        'beanLight': beanLight,
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
    beanLight: {
        value: (val) => beanLight.value(val),
        setWarningStatus: (isTrue) => {
            if (isTrue && warningInterval == null) {
                console.log('setting interval')
                warningInterval = setInterval(() => {
                    beanLight.value(!beanLight.value())
                }, 3000)
            }
            if (!isTrue && warningInterval != null) {
                console.log('clearing interval')
                clearInterval(warningInterval);
                beanLight.value(kettlePowerLED.value());
            }
        }
    }
}