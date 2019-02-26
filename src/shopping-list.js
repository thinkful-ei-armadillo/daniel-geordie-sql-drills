'use strict';

require('dotenv').config();
const knex = require('knex');
const shoppingService = require('./shopping-list-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log('connection successful');

shoppingService.getAll(knexInstance)
  .then(result => {
    console.log(result);
  });