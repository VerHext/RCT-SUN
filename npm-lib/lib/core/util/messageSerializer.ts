export const messageSerializing = (addresData: string | Uint8Array) => {
  let hexCmd: Uint8Array;
  if (typeof addresData === "string")
    hexCmd = Uint8Array.from(Buffer.from(addresData, "hex"));
  else hexCmd = addresData;

  let hexlength = hexCmd.length;
  let cmd = new Uint8Array(6);
  cmd[0] = 1;
  cmd[1] = hexlength;

  hexCmd.forEach((a: any, index: number) => {
    cmd[2 + index] = hexCmd[index];
  });
  let crc = calcRequestCRC(cmd).toString(16);
  crc = crc.length == 3 ? "0" + crc : crc;
  let cmdHex = "2b" + Buffer.from(cmd).toString("hex") + crc;
  return cmdHex;
};

const calcRequestCRC = (cmd: Uint8Array) => {
  //calc CRC 2
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
};
