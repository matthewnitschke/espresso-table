const piPins = require('pi-pins')

const beanLight = piPins.connect(22);
const wasteWater = piPins.connect(5)
const washWater = piPins.connect(6)

beanLight.mode('low');
wasteWater.mode('in');
washWater.mode('in');

let warningInterval;

module.exports = {
    pins: {
        'beanLight': beanLight,
        'wasteWater': wasteWater,
        'washWater': washWater,
    },
    on: (pinKey, callback) => {
        let pin =  module.exports.pins[pinKey]
        pin.on('both', () => callback(pin.value()))
    },
    beanLight: {
        value: (val) => beanLight.value(val),
        setWarningStatus: (isTrue) => {
            if (isTrue && warningInterval == null) {
                console.log(`Starting Warning Light - ${new Date()}`)
                warningInterval = setInterval(() => {
                    beanLight.value(!beanLight.value())
                }, 3000)
            }
            if (!isTrue && warningInterval != null) {
                console.log('clearing interval')
                clearInterval(warningInterval);
                beanLight.value(false);
            }
        }
    }
}