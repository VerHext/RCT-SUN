import * as net from "net";
var bsplit = require("buffer-split");

var client = new net.Socket();

client.connect({ host: "192.168.1.19", port: 8899 });

client.on("connect", function () {
  console.log("Client: connection established with server");

  console.log("---------client details -----------------");
  var address = client.address() as net.AddressInfo;
  console.log(`Connected to Host ${address.address}:${address.port}`);
  console.log("--------- received data -----------------");

  client.write(Buffer.from("2b010410970e9d55a3", "hex"));
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
      data.slice(e, indexArray[index + 1] ? indexArray[index + 1] : data.length)
    );
  });
});

function processCmd(cmd: Uint8Array) {
  let length = cmd[1] + cmd[2];
  let packetSize = cmd.length;
  if (length != packetSize) return;
  //lenght of response package is correct, so check CRC
  let crc = clacCRC(cmd);
  if (crc.crc.toString(16) != Buffer.from(crc.crcCheck).toString("hex")) {
    return;
  }
  //crc oke -
  let adress = cmd.slice(3, 4 + 3);
  let data = cmd.slice(4 + 3, cmd.length - 2);
  analyzeResponse(adress, data);
}

function clacCRC(cmdRaw: Uint8Array) {
  //calc CRC
  let cmd = cmdRaw.slice(1, cmdRaw.length - 2);
  let crcCheck = cmdRaw.slice(cmd.length + 1, cmdRaw.length + 3);

  let crc = 0xffff;

  cmd.forEach((b) => {
    for (let i = 0; i < 8; i++) {
      let bit = ((b >> (7 - i)) & 1) == 1;
      let c15 = ((crc >> 15) & 1) == 1;
      crc <<= 1;
      if (+!!c15 ^ +!!bit) crc ^= 0x1021;
    }
    crc &= 0xffff;
  });

  return { crc, crcCheck };
}

function analyzeResponse(adress: Uint8Array, data: Uint8Array) {
  let adressS = Buffer.from(adress).toString("hex").toUpperCase();
  let dataF = new Buffer(Buffer.from(data).toString("hex"), "hex").readFloatBE(
    0
  );

  if (adressS == "1AC87AA0") {
    console.log("HousePowerCurrent == " + Math.round(dataF));
  }
}
