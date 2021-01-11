import { SocketConnectOpts } from "net";

/**
 * @type {SocketConnectOpts} SocketConnection (nodejs/net)
 */
export type SocketConnection = SocketConfigurationRaw & SocketConnectOpts;

/**@private */
export interface SocketConfigurationRaw {
  reconnect?: boolean;
}

/**
 * @type RCTEvents
 * @description List of avaible Events
 * **incomming** - receive data from rct-power
 */
export type RCTEvents = "incomming";

/**
 * @interface RCTClientResponse
 * @property {boolean=} connected
 * @property {boolean=} destroyed
 * @property {any} exception
 */
export interface RCTClientResponse {
  connected?: boolean;
  destroyed?: boolean;
  exception?: any;
}
/**
 * @interface ReceivedMessage
 * @property {Uint8Array} address
 * @property {Uint8Array} data
 * @property {string} dataString
 * @property {string} addressString
 * @property {number=} dataNumber // if avaible
 */
export interface ReceivedMessage {
  address: Uint8Array;
  data: Uint8Array;
  dataString: string;
  addressString: string;
  dataNumber?: number;
}
