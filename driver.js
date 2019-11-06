const gpiop = require('rpi-gpio').promise;

const powerGPIOPin = 7;

let isSetup = false;
async function setup() {
    await gpiop.setup(powerGPIOPin, gpiop.DIR_OUT);
    isSetup = true;
}

module.exports = {
    on: async () => {
        if (!isSetup) await setup();
        
        await gpiop.write(powerGPIOPin, true);
    },
    off: async () => {
        if (!isSetup) await setup();

        await gpiop.write(powerGPIOPin, false);
    }
}