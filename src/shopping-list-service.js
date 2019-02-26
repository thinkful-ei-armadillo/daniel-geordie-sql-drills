'use strict';

const shoppingService = {
  getAll(knex) {
    return knex.select('*').from('shopping_list');
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first();
  },
  deleteItems(knex, id) {
    return knex('shopping_list').where({ id }).delete();
  },
  updateItem(knex, id, newItem) {
    return knex('shopping_list').where({ id }).update(newItem);
  },
  insertItem(knex, contents) {
    return knex.insert(contents).into('shopping_list').returning('*').then(rows => rows[0]);
  },
};



module.exports = shoppingService;