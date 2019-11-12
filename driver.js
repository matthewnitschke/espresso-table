const piPins = require('pi-pins')

const kettlePower = piPins.connect(17);
const kettleHold = piPins.connect(27);

const wasteWater = piPins.connect(5)

kettlePower.mode('low');
kettleHold.mode('low');

wasteWater.mode('in')

let _isWasteWaterFull = wasteWater.value();
console.log(`:: ${_isWasteWaterFull}`)
wasteWater.on('both', () => {
    _isWasteWaterFull = wasteWater.value();
    console.log(`:: ${_isWasteWaterFull}`)
})

module.exports = {
    pins: {
        'kettlePower': kettlePower,
        'kettleHold': kettlePower,
        'wasteWater': wasteWater,
    },
    isWasteWaterFull: async () => {
        return _isWasteWaterFull;
    },
    powerToggle: async () => {
        kettlePower.value(true);
        setTimeout(() => kettlePower.value(false), 1000)
    },
    holdToggle: async () => {
        kettleHold.value(true);
        setTimeout(() => kettleHold.value(false), 1000)
    },
    kettleOnProcess: async () => {
        module.exports.powerToggle();
        setTimeout(() => module.exports.holdToggle(), 3000);
    }
}