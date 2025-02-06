'use strict';
const users = require('./Users.js');
const coint = require('./ProfiCoin.js');
module.exports.Users = users;
module.exports.ProfiCoin = coint;
module.exports.contracts = [users, coint];
