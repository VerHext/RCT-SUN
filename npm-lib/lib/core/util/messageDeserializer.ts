import { ReceivedMessage } from "../client/client.types";

export const messageDeserializing = (rawInput: Uint8Array): ReceivedMessage => {
  let length = rawInput[1] + rawInput[2];
  let packetSize = rawInput.length;
  if (length != packetSize)
    throw new Error(
      "Size of packet is invalid. Please ignore this received message. "
    );
  //lenght of response package is correct, so check CRC
  let crc = calcCRC(rawInput);
  if (crc.crc.toString(16) != Buffer.from(crc.crcCheck).toString("hex")) {
    throw new Error(
      "CRC is invalid. You are sure, that this is valid message from a RTC system"
    );
  }
  let address = rawInput.slice(3, 4 + 3);
  let data = rawInput.slice(4 + 3, rawInput.length - 2);
  let dataNumber = Buffer.from(
    Buffer.from(data).toString("hex"),
    "hex"
  ).readFloatBE(0);

  return {
    address,
    data,
    dataString: Buffer.from(data).toString("hex").toUpperCase(),
    addressString: Buffer.from(address).toString("hex").toUpperCase(),
    dataNumber,
  };
};
const calcCRC = (cmdRaw: Uint8Array) => {
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
};
