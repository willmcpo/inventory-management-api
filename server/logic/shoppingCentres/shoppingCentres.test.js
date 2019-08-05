import moment from 'moment';
import {addShoppingCentre, getShoppingCentre, updateShoppingCentre} from './shoppingCentres';

describe('logic - shoppingCentres - getShoppingCentre', () => {
  it('getShoppingCentre returns the expected data', async () => {
    const currentTimestamp = +new Date();
    const mysql = {
      execute: () => [[{id: 10, name: 'Eastfield Shopping Centre', lastModifiedAt: currentTimestamp}]]
    };

    const result = await getShoppingCentre({}, {mysql});
    expect(result).toEqual({
      id: 10,
      name: 'Eastfield Shopping Centre',
      lastModifiedAt: moment(currentTimestamp).toISOString(),
    })
  });
});

describe('logic - shoppingCentres - addShoppingCentre', () => {
  it('addShoppingCentre returns the expected data', async () => {
    const mysql = {
      execute: () => [[{'last_insert_id()': 5}]]
    };

    const result = await addShoppingCentre({}, {mysql});
    expect(result.id).toEqual(5)
  });
});

describe('logic - shoppingCentres - updateShoppingCentre', () => {
  const mysql = {
    execute: jest.fn(),
  };

  afterEach(() => {
    mysql.execute.mockClear();
  });

  it('updateShoppingCentre calls execute to update the name correctly', async () => {
    await updateShoppingCentre({id: 1, name: 'Northfield Shops'}, {mysql, username: 'dude'});
    expect(mysql.execute).toBeCalledWith(
      'UPDATE shoppingCentres SET lastModifiedBy = ?, name = ? where id = ?',
      ['dude', 'Northfield Shops', 1]
    );
  });

  it('updateShoppingCentre calls execute to update the name and address correctly', async () => {
    await updateShoppingCentre({id: 1, name: 'Northfield Shops', address: '7 ABC Rd Sydney'}, {mysql, username: 'dude'});
    expect(mysql.execute).toBeCalledWith(
      'UPDATE shoppingCentres SET lastModifiedBy = ?, name = ?, address = ? where id = ?',
      ['dude', 'Northfield Shops', '7 ABC Rd Sydney', 1]
    );
  });
});
