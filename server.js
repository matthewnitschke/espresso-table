const path = require('path');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const driver = require('./driver.js');


function checkWarningLight() {
  let washWater = driver.pins['washWater'].value()
  let wasteWater = driver.pins['wasteWater'].value()
  driver.beanLight.setWarningStatus(washWater || wasteWater)
}

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
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


  io.emit('wasteWater', driver.pins['wasteWater'].value())
  io.emit('washWater', driver.pins['washWater'].value())
});

//start a server on port 80 and log its start to our console
const server = http.listen(80, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);
});
