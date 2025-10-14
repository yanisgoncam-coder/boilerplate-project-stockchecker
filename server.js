'use strict';
require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const helmet      = require('helmet');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express(); // ⬅️ app declarado antes de usar cualquier middleware

// 🔹 Seguridad con Helmet y Content Security Policy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'", "https://stock-price-checker-proxy.freecodecamp.rocks/"]
    }
  }
}));

// Servir archivos estáticos
app.use('/public', express.static(process.cwd() + '/public'));

// Para pruebas de FCC
app.use(cors({ origin: '*' }));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Página principal
app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// Rutas para pruebas FCC
fccTestingRoutes(app);

// Rutas API
apiRoutes(app);

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).type('text').send('Not Found');
});

// Iniciar servidor y pruebas
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try { runner.run(); } 
      catch (e) { console.error('Tests are not valid:', e); }
    }, 3500);
  }
});

module.exports = app; // para testing
