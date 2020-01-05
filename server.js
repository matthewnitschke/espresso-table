const path = require('path');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const driver = require('./driver.js');


function checkWarningLight() {
  let washWater = driver.pins['washWater'].value()
  let wasteWater = driver.pins['wasteWater'].value()
  console.log(`${washWater} :: ${wasteWater}`)
  driver.beanLight.setWarningStatus(washWater || wasteWater)
}

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/on', async (req, res) => {
  console.log('Kettle On');
  await driver.kettlePowerHold();
  res.status(200).send('Ok');
});

app.get('/off', async (req, res) => {
  console.log('Kettle On');
  await driver.kettlePowerToggle();
  res.status(200).send('Ok');
});

io.on('connection', (socket) => {
  driver.on('wasteWater', (isFull) => {
    io.emit('wasteWater', isFull)

    checkWarningLight()
  })

  driver.on('washWater', (isFull) => {
    io.emit('washWater', isFull)

    checkWarningLight()
  })

  driver.on('kettlePowerLED', (isOn) => {
    io.emit('kettlePowerLED', isOn);

    if (isOn) {
      driver.pins['beanLight'].value(true)
    } else {
      driver.pins['beanLight'].value(false)
    }
  })

  io.emit('wasteWater', driver.pins['wasteWater'].value())
  io.emit('washWater', driver.pins['washWater'].value())
  io.emit('kettlePowerLED', driver.pins['kettlePowerLED'].value());
});

//start a server on port 80 and log its start to our console
const server = http.listen(80, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);
});
