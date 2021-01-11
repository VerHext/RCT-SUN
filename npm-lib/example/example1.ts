/**
 * We want to connect to our RCT power inverter and request the total houshold power in kW
 * 1. We need to build a tcp socket and connect
 * 2. We need a command hash. We use the docu on: https://verhext.github.io/rct-sun#commands
 *    Oke now we use the search function and find out the hash "EFF4B537"
 * 3. Implement a listener to receive the answear.
 * 4. Now we are ready to send the hash command to our rct-power inverter.
 */

// Install this lib from npm $ npm install rct-sun
import { RCTClient, ReceivedMessage } from "../lib";

const HASH_COMMAND = "EFF4B537";

(async () => {
  //Step - 1
  let client = RCTClient();

  //We connect to rct power inverter
  await client
    .connect({
      port: 8899, // default port
      reconnect: true,
      host: "192.168.1.19", // the ip of your power inverter
    })
    .then(async (e) => {
      console.log(
        `> ${e?.connected ? "Yeah, connected" : "Oh no, not connected"}`
      );

      await client.on("incomming", (cmd: ReceivedMessage) => {
        if (cmd.addressString === HASH_COMMAND) {
          console.log(
            `> Wow, we have consumed a lot of electricity: ${cmd?.dataNumber} kw.`
          );
          client.disconnect();
        }
      });

      await client.send(HASH_COMMAND).catch((error: any) => console.error);
    })
    .catch((e) => console.log("Exception during connection " + e));
})();
