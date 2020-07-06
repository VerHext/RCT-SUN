import * as net from "net";
import fs from "fs";
import { ConfigItem, ClientConfig, DatabaseConfig } from "./types";
import { processCmd } from "./processCmd";
import { sendCmdBuilder } from "./sendCmd";
require("dotenv").config();
import * as sql from "./database";

export const config: ClientConfig = loadConfig("./config/client.json");
export const AddresData: ConfigItem[] = loadConfig("./config/config.json");

var client = new net.Socket();
client.connect(config);
sql.migrate();

client.on("connect", function () {
  console.log("---------client details -----------------");
  var address = client.address() as net.AddressInfo;
  console.log(`Connected to Host ${address.address}:${address.port}`);
  console.log("--------- received data -----------------");

  setInterval(function () {
    AddresData.map((item: ConfigItem) => {
      if (item.request)
        client.write(
          Uint8Array.from(Buffer.from(sendCmdBuilder(item.address), "hex"))
        );
    });
  }, config.refresh);
});

client.on("close", function () {
  client.connect(config);
});

client.on("data", function (response) {
  let data = Uint8Array.from(response);

  let indexArray: number[] = [];
  data.forEach((e: number, index: number, array: Uint8Array) => {
    if (e == 43) {
      indexArray.push(index);
    }
  });

  indexArray.map((e: number, index: number) => {
    //Plain cmd without 0x2b
    processCmd(
      data.slice(
        e,
        indexArray[index + 1] ? indexArray[index + 1] : data.length
      ),
      AddresData
    );
  });
});

function loadConfig(configPath: string) {
  const data = fs.readFileSync(configPath);
  return JSON.parse(data.toString());
}
