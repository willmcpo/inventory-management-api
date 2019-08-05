export async function getMediaAssets({id, name, associatedShoppingCentreId, status}, {mysql}) {
  const whereFields = [];
  const whereValues = [];

  if (id) {
    whereFields.push(`id = ?`);
    whereValues.push(id);
  } else {
    if (name) {
      whereFields.push(`name = ?`);
      whereValues.push(name);
    }

    if (associatedShoppingCentreId) {
      whereFields.push(`associatedShoppingCentreId = ?`);
      whereValues.push(associatedShoppingCentreId);
    }

    if (status) {
      whereFields.push(`status = ?`);
      whereValues.push(status);
    }
  }

  const [rows] = await mysql.execute(`SELECT * FROM mediaAssets WHERE ${whereFields.join(', ')}`, whereValues);

  return rows.map(({id, name, width, height, associatedShoppingCentreId, associatedShoppingCentreLocation, status, lastModifiedAt, lastModifiedBy}) => ({
    id,
    name,
    dimensions: {
      width,
      height,
    },
    ...associatedShoppingCentreId
      ? {
        associatedShoppingCentreId: {
          id: associatedShoppingCentreId,
          location: associatedShoppingCentreLocation,
        }
      }
      : {}
    ,
    status,
    lastModifiedAt,
    lastModifiedBy
  }));
}

export async function addMediaAsset({name, width, height}, {mysql, username}) {
  await mysql.execute(`INSERT into mediaAssets(name, width, height, lastModifiedBy, status) values (?, ?, ?, ?, 'inactive')`, [name, width, height, username]);
  const [[result]] = await mysql.execute('SELECT last_insert_id()');
  return {
    id: result['last_insert_id()']
  }
}

export async function removeMediaAsset({id}, {mysql}) {
  await mysql.execute('DELETE from mediaAssets where id = ?', [id]);
}

export async function associateMediaAssetWithShoppingCentre({id, associatedShoppingCentreId, associatedShoppingCentreLocation}, {mysql, username}) {
  await mysql.execute(`UPDATE mediaAssets 
  SET associatedShoppingCentreId = ?, associatedShoppingCentreLocation = ?, lastModifiedBy = ? 
  where id = ?`, [associatedShoppingCentreId, associatedShoppingCentreLocation, username, id]);
}

export async function disassociateMediaAssetFromShoppingCentre({id}, {mysql, username}) {
  await mysql.execute(`UPDATE mediaAssets 
  SET associatedShoppingCentreId = null, associatedShoppingCentreLocation = null, lastModifiedBy = ?  
  where id = ?`, [username, id]);
}

export async function updateMediaAssetStatus({id, status}, {mysql, username}) {
  await mysql.execute(`UPDATE mediaAssets 
  SET status = ?, lastModifiedBy = ?   
  where id = ?`, [status, username, id]);
}
