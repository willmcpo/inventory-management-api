import moment from 'moment';

export async function getShoppingCentre({id}, {mysql}) {
  const shoppingCentresResult = await mysql.execute('SELECT id, name, address, lastModifiedAt, lastModifiedBy FROM `shoppingCentres` WHERE `id` = ?', [id]);
  const [[shoppingCentreRow]] = shoppingCentresResult;
  return {
    ...shoppingCentreRow,
    lastModifiedAt: moment(shoppingCentreRow.lastModifiedAt).toISOString(),
  };
}

export async function addShoppingCentre({name, address}, {mysql, username}) {
  await mysql.execute('INSERT into shoppingCentres(name, address, lastModifiedBy) values (?, ?, ?)', [name, address, username]);
  const [[result]] = await mysql.execute('SELECT last_insert_id()');
  return {
    id: result['last_insert_id()']
  }
}

export async function removeShoppingCentre({id}, {mysql}) {
  await mysql.execute('DELETE from shoppingCentres where id = ?', [id]);
}

export async function updateShoppingCentre({id, name, address}, {mysql, username}) {
  const setItems = [`lastModifiedBy = ?`];
  const values = [username];

  if (name) {
    setItems.push(`name = ?`);
    values.push(name);
  }

  if (address) {
    setItems.push(`address = ?`);
    values.push(address);
  }

  values.push(id);

  await mysql.execute(`UPDATE shoppingCentres SET ${setItems.join(', ')} where id = ?`, values);
}
