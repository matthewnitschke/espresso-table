const express = require('express');
const app = express();

const driver = require('./driver.js');

// Enable HTML template middleware
app.engine('html', require('ejs').renderFile);

// Enable static CSS styles
app.use(express.static('styles'));

// reply to request with "Hello World!"
app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/on', async (req, res) => {
  console.log('Power On');
  await driver.on();
  res.status(200).send('Ok');
})

app.get('/off', async (req, res) => {
  console.log('Power Off');
  await driver.off();
  res.status(200).send('Ok');
})

//start a server on port 80 and log its start to our console
var server = app.listen(80, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);

});
