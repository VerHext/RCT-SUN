export function processCmd(cmd: Uint8Array, AddresData: any) {
  let length = cmd[1] + cmd[2];
  let packetSize = cmd.length;
  if (length != packetSize) return;
  //lenght of response package is correct, so check CRC
  let crc = calcCRC(cmd);
  if (crc.crc.toString(16) != Buffer.from(crc.crcCheck).toString("hex")) {
    return;
  }
  //crc oke -
  let adress = cmd.slice(3, 4 + 3);
  let data = cmd.slice(4 + 3, cmd.length - 2);
  analyzeResponse(adress, data, AddresData);
}

export function calcCRC(cmdRaw: Uint8Array) {
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

export function analyzeResponse(
  address: Uint8Array,
  data: Uint8Array,
  AddresData: any
) {
  let addressS = Buffer.from(address).toString("hex").toUpperCase();

  AddresData.map((item: any) => {
    let dataF = new Buffer(
      Buffer.from(data).toString("hex"),
      "hex"
    ).readFloatBE(0);

    if (item.floatOptions != undefined) {
      dataF = eval(dataF + item.floatOptions);
    }
    if (item.address == addressS) {
      if (item.round && item.precision) {
        dataF = round(dataF, item.precision ? item.precision : 0);
      } else {
        dataF = Math.round(dataF);
      }

      console.log(`[LOG] ${item.description} :: ${dataF}`);
    }
  });
}

export function round(x: number, n: number) {
  var a = Math.pow(10, n);
  return Math.round(x * a) / a;
}

export function calcRequestCRC(cmd: Uint8Array) {
  //calc CRC 2)

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

  return crc;
}
