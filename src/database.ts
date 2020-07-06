import * as cfg from "./client";
const DATE_FORMATER = require("dateformat");
import { createConnection, QueryError, RowDataPacket } from "mysql2";
console.log(process.env.database);
const connection = createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

export async function migrate() {
  cfg.AddresData.forEach(async (item) => {
    await connection.execute(
      `CREATE TABLE IF NOT EXISTS ${item.address} (
        id	INTEGER NOT NULL UNIQUE AUTO_INCREMENT,
        date DATETIME NULL,
        value ${item.dbFloat ? "FLOAT" : "INT"} NULL)`
    );
  });
}

export async function saveValue(address: string, value: number) {
  console.log(
    `INSERT INTO ${address} :: ${value} -- ${DATE_FORMATER(
      new Date(),
      "yyyy-mm-dd HH:MM:ss"
    )}`
  );
  connection.execute(`INSERT INTO ${address} (date, value) VALUES (?, ?)`, [
    DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss"),
    value,
  ]);
}
