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
  .then(result => {console.log(result);})
  .then(() => 
    shoppingService.insertItem(knexInstance, {
      name: 'new name',
      price: 1,
      date_added: new Date(),
      checked: false,
      category: 'Main'
    })
  )
  .then(newItem => {
    console.log(newItem);
    return shoppingService.updateItem(
      knexInstance,
      newItem.id,
      { name: 'updated name'}
    ).then(() => shoppingService.getById(knexInstance, newItem.id));
  })
  .then(item => {
    console.log(item);
    return shoppingService.deleteItems(knexInstance, item.id);
  });