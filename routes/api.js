'use strict';
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch instalado
const crypto = require('crypto');
const Stock = require('../controllers/stocks');

module.exports = function(app) {

  app.route('/api/stock-prices')
    .get(async function(req, res) {
      try {
        let { stock, like } = req.query;
        like = like === 'true';
        const stocks = Array.isArray(stock) ? stock : [stock];

        // IP anonima
        const userIP = req.ip || req.connection.remoteAddress;
        const hashedIP = crypto.createHash('sha256').update(userIP).digest('hex');

        const results = [];

        for (let s of stocks) {
          // Llamar al proxy FreeCodeCamp
          const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${s}/quote`;
          const response = await fetch(url);
          const data = await response.json();

          let stockData = await Stock.getOrCreateStock(s);
          if (like) await Stock.addLike(stockData, hashedIP);

          results.push({
            stock: s.toUpperCase(),
            price: parseFloat(data.latestPrice),
            likes: stockData.likes.length
          });
        }

        // Si hay dos stocks, calcular rel_likes
        if (results.length === 2) {
          const rel1 = results[0].likes - results[1].likes;
          const rel2 = results[1].likes - results[0].likes;
          return res.json({
            stockData: [
              { stock: results[0].stock, price: results[0].price, rel_likes: rel1 },
              { stock: results[1].stock, price: results[1].price, rel_likes: rel2 }
            ]
          });
        }

        // Solo un stock
        res.json({ stockData: results[0] });

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
    });
};
