import mysql from "mysql";
import { DatabaseConfig } from "./types";

export async function connect(config: DatabaseConfig) {
  var con = await mysql.createConnection(config);

  con.connect(function (err: any) {
    if (err) throw err;
    console.log("Connected!");
  });
}
