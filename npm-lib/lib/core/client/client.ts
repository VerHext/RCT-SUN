import { Socket } from "net";
import { RCTClientResponse, RCTEvents, SocketConnection } from "./client.types";
import { EventEmitter } from "events";
import { messageDeserializing } from "../util/messageDeserializer";
import { messageSerializing } from "../util/messageSerializer";
import { RCTClientInterface } from "./client.module";

export const RCTClient = (): RCTClientInterface => {
  const client = new Socket();
  const eventEmitter = new EventEmitter();

  return {
    connect(config: SocketConnection): Promise<RCTClientResponse> {
      return new Promise<RCTClientResponse>((resolve, reject) => {
        try {
          client.connect(config);
          client.on("connect", async (exception: any) => {
            resolve({
              connected: true,
              exception,
            });
          });
          client.on("data", (rawData: Buffer) => {
            try {
              let data = Uint8Array.from(rawData);
              let indexArray: number[] = [];
              data.forEach((e: number, index: number, array: Uint8Array) => {
                if (e == 43) {
                  indexArray.push(index);
                }
              });
              indexArray.forEach((e: number, index: number) => {
                //Plain cmd without 0x2b
                let cmd = messageDeserializing(
                  data.slice(
                    e,
                    indexArray[index + 1] ? indexArray[index + 1] : data.length
                  )
                );
                eventEmitter.emit("incomming", cmd);
              });
            } catch (e) {
              /**
               * This catch - ignore bad or invalid request who are incomming over tcp socket.
               * Messages are invalid if CRC or packet size are invalid or not present.
               * But also commands for device settings etc. Not supported by this lib at the moment.
               */
            }
          });
        } catch (exception) {
          reject({
            connected: false,
            exception,
          });
        }
      });
    },
    disconnect(): Promise<RCTClientResponse> {
      return new Promise<RCTClientResponse>((resolve, reject) => {
        try {
          client.end();
          client.destroy();
          resolve({
            connected: false,
            destroyed: client.destroyed,
          });
        } catch (exception) {
          reject({
            connected: false,
            exception,
          });
        }
      });
    },
    on(event: RCTEvents, callback: any): EventEmitter {
      return eventEmitter.on(event, callback);
    },
    send(event: string | Uint8Array): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        try {
          client.write(
            Uint8Array.from(Buffer.from(messageSerializing(event), "hex"))
          );
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    },
  };
};
