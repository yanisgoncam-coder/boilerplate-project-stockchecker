'use strict';

// Base de datos en memoria
const stocksDB = {};

module.exports = {
  // Obtener o crear un stock en la "base de datos"
  getOrCreateStock: async function(symbol) {
    symbol = symbol.toUpperCase();
    if (!stocksDB[symbol]) {
      stocksDB[symbol] = { symbol, likes: [] };
    }
    return stocksDB[symbol];
  },

  // Agregar un like si la IP no ha votado antes
  addLike: async function(stockData, hashedIP) {
    if (!stockData.likes.includes(hashedIP)) {
      stockData.likes.push(hashedIP);
    }
  }
};
