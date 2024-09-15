import { get, writable } from 'svelte/store';
export const socketState = writable(null);
export const socketStates = {
 CONNECTING: 0,
 OPEN: 1,
 CLOSING: 2,
 CLOSED: 3
}
export let url;
const requests = {};
let socket;

export function connect(server = null) {
 if (socket && get(socketState) !== socketStates.CLOSED) {
  console.error('Socket is already connected');
  return;
 }
 if (server) url = server;
 socket = new WebSocket(url);
 socketState.set(socket.readyState);
 socket.onopen = () => socketState.set(socket.readyState);
 socket.onerror = () => socketState.set(socket.readyState);
 socket.onclose = () => socketState.set(socket.readyState);
 socket.onmessage = event => handleResponse(JSON.parse(event.data));
}

export function disconnect() {
 if (!socket) {
  console.error('Socket is not yet created');
  return;
 }
 if (socketState !== socketStates.OPEN) {
  console.error('Socket is opened');
  return;
 }
 socket.close();
}

export function send(command, params = {}, sessionID = null, callback = null) {
 //console.log('------------------');
 //console.log('SENDING COMMAND:');
 //console.log('COMMAND:', command);
 //console.log('PARAMS:', params);
 //console.log('SESSION ID:', sessionID);
 //console.log('CALLBACK:', callback);
 //console.log('------------------');
 if (!socket || get(socketState) !== socketStates.OPEN) {
  console.error('Error while sending command: WebSocket is not open');
  return;
 }
 const requestID = getRandomString();
 const req = { requestID };
 if (sessionID) req.sessionID = sessionID;
 if (command) req.command = command;
 if (params) req.params = params;
 requests[requestID] = { req, callback };
 socket.send(JSON.stringify(req));
}

function handleResponse(res) {
 //console.log('RESPONSE', res);
 if (res.requestID) {
  const reqData = requests[res.requestID];
  if (reqData?.req?.command) {
   //console.log('REQUEST', reqData.req);
   if (reqData.callback) reqData.callback(reqData.req, res);
   delete requests[res.requestID];
  } else console.log('Request command not found');
 } else console.log('Unknown command from server');
}

function getRandomString(length = 40) {
 let result = '';
 while (result.length < length) result += Math.random().toString(36).substring(2);
 return result.substring(0, length);
}

export default {
 socketState,
 socketStates,
 connect,
 disconnect,
 send,
 url
};
