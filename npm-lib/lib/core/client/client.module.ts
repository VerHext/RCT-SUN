import { EventEmitter } from "events";
import { RCTClientResponse, RCTEvents, SocketConnection } from "./client.types";

/**
 * @module RCTClient
 * @description The RCTClient is the bridge between your rct power inverter and this lib.<br/>
 * The first step is to implement this RCTClient and connect it to your rct power inverter.<br/>
 * @example 	
	let client = RCTClient();
	client.connect({
    port: 8899, //default 8899 
    reconnect: true, // recommend: Allow this lib to automatic reconnect if connection lose or RCT close session.
    host: "192.168.1.2", // The IP Adress of your rct-power inverter. You can find it out via the offical APP or in your router
  })
 *
 */
export interface RCTClientInterface {
  /**
   * @description Opens a new tcp socket and try to connect to the rct-power inverter.
   * @param {SocketConnection} config
   * @return {Promise<RCTClientResponse>} Promise<RCTClientResponse>
   */
  connect: <T = any>(config: SocketConnection) => Promise<RCTClientResponse>;
  /**
   * @description Disconnect and close / destroy socket.
   * @return {RCTClientResponse} RCTClientResponse
   */
  disconnect: () => Promise<RCTClientResponse>;
  /**
   * @description Listen to RCT events. Here you can find a list with all Events [RCTEvents](#RCTEvents)
   * @example client.on("incomming", (cmd: ReceivedMessage) => {
        console.log(cmd);
      });
   * @param {RCTEvents} events
   * @return {EventEmitter} EventEmitter
   */
  on: (event: RCTEvents, callback: any) => EventEmitter;
  /**
   * @description Send requests to the rct power inverter **You can find a list of commands here [Commands](#commands)**
   * @example client
        .send("EFF4B537") // this is the hash for total houshold energy (Wh)
        .then((status) => console.log("Send request successful"));
        .catch((e) => console.error)
   * @param {string | Uint8Array} address // Use the command hash
   * @return {Promise<boolean>} status
   */
  send: (address: string | Uint8Array) => Promise<boolean>;
}
