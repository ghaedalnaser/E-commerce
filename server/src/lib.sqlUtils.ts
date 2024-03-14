// import { PoolClient } from 'pg';
// import * as pg from './lib.pool'
import { objectify } from "../../utils/objectify";

export const generateUpdateQuery = <T>(
  tableName: string,
  defaultObject: T,
  updateObj: Partial<T>,
  deleteId = true
) => {
  const cleaned = cleanObject<T>(defaultObject, updateObj);
  if (deleteId && "id" in cleaned) delete cleaned["id"];
  let paramCounter = 0;
  let text = `UPDATE ${tableName} SET`;
  const values: any[] = [];
  for (const key in cleaned) {
    text += ` "${key}" = $${++paramCounter},`;
    values.push(cleaned[key]);
  }
  if (paramCounter) text = text.substr(0, text.length - 1);
  text += ' ';
  return { text, values, paramCounter };
};

export const generateInsertQuery = <T>(
  tableName: string,
  defaultObject: T,
  insertObj: Partial<T>,
  returnRow = true,
  deleteId = true
) => {
  const cleaned = cleanObject<T>(defaultObject, insertObj);
  console.log(cleaned);
  if (deleteId && "id" in cleaned) delete cleaned["id"];
  let paramCounter = 0;
  let text = `INSERT INTO ${tableName} (${Object.keys(cleaned)
    .map((field) => `"${field}"`)
    .join(",")}) VALUES (`;
  const values: any[] = [];
  for (const key in cleaned) {
    text +=`$${++paramCounter},`;
    values.push(cleaned[key]);
  }
  if (paramCounter) text = text.substr(0, text.length - 1);
  text += ") ";
  if (returnRow) text += "RETURNING * ";
   console.log(text);
  return { text, values, paramCounter };
};
// export const generateSelectQueryText = <T> ( tableName: string, fields: ( keyof T )[] ) => {
// 	return `SELECT ${ fields.map( field => `"${ field }"` ).join( ',' ) } from ${ tableName } `;

// // }
// export const generateBulkInsertQuery = <T> ( tableName: string, defaultObject: T, insertObjs: Partial<T>[], returnRow = true, deleteId = true ) => {
// 	if ( insertObjs.length === 0 ) throw new Error( 'bulk insert on empty array' );
// 	const usedDefaultObject = { ...defaultObject };
// 	let cleanedArray = insertObjs.map( insertObj => cleanObject<T>( defaultObject, insertObj ) );
// 	if ( deleteId ) {
// 		cleanedArray = cleanedArray.map( cleaned => {
// 			if ( 'id' in cleaned ) {
// 				delete cleaned[ 'id' ];
// 			}
// 			return cleaned;
// 		} );
// 		if ( 'id' in usedDefaultObject )
// 			delete usedDefaultObject[ 'id' ];
// 	}
// 	let paramCounter = 0;
// 	let text = `INSERT INTO ${ tableName } (${ Object.keys( usedDefaultObject ).map( field => `"${ field }"` ).join( ',' ) }) VALUES `;
// 	if ( !cleanedArray.length || cleanedArray.length === 0 ) throw new Error( 'Empty bulk insert array!' );
// 	const inserts = cleanedArray.map( cleanedObject => {
// 		const paramValues: any[] = [];
// 		let params = '(';
// 		for ( const key in usedDefaultObject ) {
// 			params += `$${ ++paramCounter },`;
// 			if ( key in cleanedObject )
// 				paramValues.push( cleanedObject[ key ] );
// 			else paramValues.push( null );
// 		}
// 		params = params.substr( 0, params.length - 1 );
// 		params += ')';
// 		return { params, values: paramValues };
// 	}
// 	);
// 	text += inserts.map( insert => insert.params ).join( ',' );
// 	const values = inserts.map( insert => insert.values ).flat( 1 );
// 	if ( returnRow )
// 		text += 'RETURNING * ';

// 	return { text, values, paramCounter };

// }
/**
 * Will not update 'id' field even if it's not the conflict field
 * @param tableName
 * @param defaultObject
 * @param upsertObjs
 * @param returnRow return upserted rows if true
 * @param conflictField
//  */
// export const generateBulkUpsertQuery = <T> ( tableName: string, defaultObject: T, upsertObjs: Partial<T>[], returnRow = true, conflictField: keyof ( T & { id?: string } ) = 'id' ) => {
// 	const defaultWithNoId = { ...defaultObject };
// 	if ( 'id' in defaultWithNoId )
// 		delete defaultWithNoId[ 'id' ];
// 	const cleanedArray = upsertObjs.map( upsertObj => cleanObject<T>( defaultObject, upsertObj ) );

// 	let paramCounter = 0;
// 	let text = `INSERT INTO ${ tableName } (${ Object.keys( defaultObject ).map( field => `"${ field }"` ).join( ',' ) }) VALUES `;
// 	const upserts = cleanedArray.map( cleanedObject => {
// 		const paramValues: any[] = [];
// 		let params = '(';
// 		for ( const key in defaultObject ) {
// 			params += `$${ ++paramCounter },`;
// 			if ( key in cleanedObject )
// 				paramValues.push( cleanedObject[ key ] );
// 			else paramValues.push( null );
// 		}
// 		params = params.substr( 0, params.length - 1 );
// 		params += ')';
// 		return { params, values: paramValues };
// 	}
// 	);
// 	text += upserts.map( insert => insert.params ).join( ',' );
// 	const values = upserts.map( insert => insert.values ).flat( 1 );
// 	text += ` ON CONFLICT(${ conflictField }) DO UPDATE SET  ${ Object.keys( defaultWithNoId ).filter( key => key !== conflictField ).map( field => `"${ field }" = EXCLUDED."${ field }"` ).join( ',' ) }`
// 	if ( returnRow )
// 		text += 'RETURNING * ';

// 	return { text, values, paramCounter };

// }

// export const bulkUpdate = async <T> ( client: PoolClient, tableName: string, defaultObject: T, updateObjs: Partial<T>[], returnRow = true ) => {

// 	const defaultWithNoId = { ...defaultObject };
// 	if ( 'id' in defaultWithNoId )
// 		delete defaultWithNoId[ 'id' ];
// 	await client.query( `create TEMP table tmp as select * from ${ tableName } limit 0;` );
// 	const bulkInsertQuery = generateBulkInsertQuery( 'tmp', defaultObject, updateObjs, false, false );
// 	await client.query( bulkInsertQuery.text, bulkInsertQuery.values );
// 	const res = await client.query<T>( `UPDATE ${ tableName } SET  ${ Object.keys( defaultWithNoId ).map( field => `"${ field }" = tmp."${ field }"` ).join( ',' ) }
// 	from tmp Where ${ tableName }.id = tmp.id ${ returnRow ? 'RETURNING *' : '' };` );
// 	return res.rows;

// }

export const generateDeleteQuery = <T>(tableName: string, criterias: any) => {
  let paramCounter = 0;
  let text = `DELETE FROM ${tableName} WHERE`;
  const values: any[] = [];
  for (const key in criterias) {
    text += ` "${key}" = $${++paramCounter} AND`;
    values.push(criterias[key]);
  }
  if (paramCounter) text = text.substr(0, text.length - 3);
  text += "; ";

  return { text, values };
};

export const generateBulkDeleteQuery = <T>(
  tableName: string,
  key: string,
  valueArray: any[]
) => {
  let text = `DELETE FROM ${tableName} WHERE`;
  const values: any[] = [];
  text += ` "${key}" = ANY ($1);`;
  values.push(valueArray);
  return { text, values };
};

export const cleanObject = <T>(defaultObject, targetObject: Partial<T>) => {
  const cleaned = objectify(targetObject);
  for (const key in targetObject)
    if (!(key in defaultObject)) delete cleaned[key];
  return cleaned;
};

// export const executeTransaction = async <T> ( queries: any[] ) => {
// 	const results: any[] = [];
// 	const client = await pg.db.connect();

// 	try {
// 		await client.query( 'BEGIN' );
// 		for ( const query of queries ) {
// 			const queryResult = await client.query<T>( query.text, query.values );
// 			results.push( queryResult );
// 		}
// 		await client.query( 'COMMIT' );
// 		return results;
// 	} catch ( error ) {
// 		await client.query( 'ROLLBACK' );
// 		throw error;
// 	} finally {
// 		client.release();
// 	}
// }
