import { open } from "sqlite";
import sqlite3 from  "sqlite3"

async function getDBHandler(){
  try {
    const dbHandler = await open({
      filename: "todo.db",
      driver: sqlite3.Database,
    });

    if(!dbHandler)
    throw new TypeError(`DB Handler expected got ${dbHandler} `);

    return dbHandler;

  } catch (error) {
    console.error(
      `Something went wrong when trying to create the DB Hamdler: ${error.message}`
    );
  }
}

async function initDB(){
  try {
    const dbHandler = await getDBHandler()
    
    dbHandler.exec(
      `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        tittle TEXT,
        description TEXT,
        is_done INTEGER DEFAULT 0
      )`
    );

    await dbHandler.close();
  } catch (error) {
    console.error(
      `There was an error trying to init the DB: ${error.message}`
    );
  }
}

export {initDB, getDBHandler};