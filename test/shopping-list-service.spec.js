'use strict';
const shoppingService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping list service object', () => {
    const db;
    const testItems = [
        {
            id: 1,
            name: 'first',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            price: '5',
            category: 'Main'
        },
        {
            id: 2,
            name: 'first',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            price: '5',
            category: 'Main'
        },
        {
            id: 3,
            name: 'first',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            price: '5',
            category: 'Main'
        },
    ];
    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL
      });
    });

    before(() => db('shopping_list').truncate());
    afterEach(() => db('shopping_list').truncate());
    after(() => db.destroy());

    context('Given Shopping List has data', () => {
        beforeEach(() => {
            return db.into('shopping_list').insert(testItems);
        });

        it('getAll gets everything', () => {
            const expectedItems = testItems.map(item => ({
                ...item,
                checked: false
            }));
            return shoppingService.getAll(db).then(actual => {
                expect(actual).to.eql(expectedItems);
            });
        });

        it('getById gets the correct item by ID', () => {
            const idToGet = 3;
            const thirdItem = testItems[idToGet - 1];
            return shoppingService.getById(db, idToGet).then(actual => {
                expect(actual).to.eql({
                   id: idToGet,
                   name: thirdItem.name,
                   date_added: thirdItem.date_added,
                   price: thirdItem.price,
                   category: thirdItem.category,
                   checked: false
                })
            })
        });

        it('deltes item with correctly', () => {
            const idToDel = 2;
            return shoppingService.deleteItems(db, idToDel).then(() => {
                shoppingService.getAll(db).then(items => {
                    const expected = testItems.filter(item => item.id !== idToDel)
                        .map(item => ({
                            ...item,
                            checked: false
                        }));
                    expect(items).to.eql(expected);
                });
            });
        });

        it('updates items properly', () => {
            const idToUp = 3;
            const updatedInfo = {
                name: 'new',
                price: '1',
                date_added: new Date(),
                checked: true
            }
            const testItem = testItems[idToUp -1];
            return shoppingService.updateItem(db, idToUp, updatedInfo).then(() => 
                shoppingService.getById(db, idToUp)
            ).then(item => expect(item).to.eql({
                id: idToUp,
                ...testItem,
                ...updatedInfo
            }));
        })
    })
});
