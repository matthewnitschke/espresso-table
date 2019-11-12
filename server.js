const path = require('path');
const express = require('express');
const app = express();

const driver = require('./driver.js');

// Enable static CSS styles
app.use(express.static('styles'));

// reply to request with "Hello World!"
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/on', async (req, res) => {
  console.log('Kettle On');
  await driver.kettleOnProcess();
  res.status(200).send('Ok');
})

app.get('/off', async (req, res) => {
  console.log('Kettle On');
  await driver.powerToggle();
  res.status(200).send('Ok');
})

app.get('/isWasteWaterFull', async (req, res) => {
  res.status(200).send(driver.isWasteWaterFull());
})

//start a server on port 80 and log its start to our console
var server = app.listen(80, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);

});
