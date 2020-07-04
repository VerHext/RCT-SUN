import * as net from "net";
import fs from "fs";
import { ConfigItem, ClientConfig } from "./types";
import { processCmd } from "./processCmd";

const config: ClientConfig = loadConfig("./config/client.json");
const AddresData: ConfigItem[] = loadConfig("./config/config.json");

var client = new net.Socket();
client.connect(config);

client.on("connect", function () {
  console.log("---------client details -----------------");
  var address = client.address() as net.AddressInfo;
  console.log(`Connected to Host ${address.address}:${address.port}`);
  console.log("--------- received data -----------------");

  client.write(Buffer.from("2b010410970e9d55a3", "hex"));
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
