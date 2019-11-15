const path = require('path');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const driver = require('./driver.js');

app.use(express.static('styles'));

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
  })

  driver.on('washWater', (isFull) => {
    io.emit('washWater', isFull)
  })

  driver.onKettlePower((isOn, powerTime) => {
    io.emit('kettlePowerLED', {
      isOn: isOn,
      powerTime: powerTime
    });
  })

  io.emit('wasteWater', driver.pins['wasteWater'].value())
  io.emit('washWater', driver.pins['washWater'].value())
  io.emit('kettlePowerLED', {
    isOn: driver.pins['kettlePowerLED'].value()
  });
});

//start a server on port 80 and log its start to our console
const server = http.listen(80, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);
});
