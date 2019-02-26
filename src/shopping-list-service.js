'use strict';

const shoppingService = {
  getAll(knex) {
    return knex.select('*').from('shopping_list');
  },
  insertItem(knex, contents) {
    return knex.insert(contents).into('shopping_list').returning('*').then(rows => rows[0]);
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first();
  },
  deleteItems(knex, id) {
    return knex('shopping_list').where({id}).delete();
  },
  updateItem(knex, id, data) {
    return knex('shopping_list').where({id}).update(data);
  },
};



module.exports = shoppingService;