// server.js
// where your node app starts

// init project
var express = require('express')
var fs = require('fs')
var app = express()

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/image', function (request, response) {
  var CanvasTextWrapper = require(
    './public/canvas-text-wrapper'
  ).CanvasTextWrapper

  var string = 'Hello, World'

  var fontSize = 16
  var canvasPadding = 1.5625 * fontSize
  var logoHeight = 2 * fontSize
  var logoWidth = 2.5 * fontSize
  var logoFontSize = 1.5 * fontSize
  var canvasWidth = 28.125 * fontSize
  var canvasHeight = 14.375 * fontSize

  var Canvas = require('canvas')
  var Image = Canvas.Image
  var canvas = new Canvas(canvasWidth, canvasHeight)
  var context = canvas.getContext('2d')

  // Draw background
  context.fillStyle = '#055f9f'
  context.fillRect(0, 0, canvasWidth, canvasHeight)
  context.fillStyle = 'white'

  // Draw logo
  fs.readFile('./public/logo.png', function (err, img) {
    if (err) throw err
    var logo = new Image()
    logo.src = img
    var logoX = canvasPadding
    var logoY = canvas.height - logoHeight - canvasPadding
    logo.width = logoWidth
    logo.height = logoHeight
    context.drawImage(logo, logoX, logoY, logo.width, logo.height)
    CanvasTextWrapper(canvas, 'GOV.UK', {
      font: 'bold ' + logoFontSize + 'px Arial, sans-serif',
      textAlign: 'left',
      verticalAlign: 'bottom',
      paddingX: logoWidth + 2 * fontSize,
      paddingY: canvasPadding
    })
  })

  // Draw main text
  CanvasTextWrapper(canvas, string, {
    font: 'bold 50px Arial, sans-serif',
    lineHeight: '10px',
    textAlign: 'left',
    sizeToFill: true,
    paddingX: canvasPadding,
    paddingRight: 100,
    paddingLeft: canvasPadding,
    paddingTop: canvasPadding,
    paddingBottom: logoHeight + canvasPadding * 2.5
  })

  var html = '<img src="' + canvas.toDataURL() + '" />'
  response.send(html)
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
