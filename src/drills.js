'use strict';
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log('connection successful');

function getAllText(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(`Results from search ${searchTerm}:`);
      console.log(result);
    });
}

// getAllText('wings');

function paginate(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(`Results from page ${pageNumber}:`);
      console.log(result);
    });
}

// paginate(1);

function getItemsAfter(daysAgo) {
  knexInstance
    .select('name', 'date_added')
    .count('date_added')
    .where(
      'date_added',
      '<',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .groupBy('id')
    .orderBy(
      [{ column: 'id', order: 'DESC'},]
    )
    .then(result => {
      console.log(`Results from more than ${daysAgo} days ago:`);
      console.log(result);
    });
}

// getItemsAfter(30);

function sumAllCategories() {
  knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log('Total price per each category:');
      console.log(result);
    });
}

sumAllCategories();