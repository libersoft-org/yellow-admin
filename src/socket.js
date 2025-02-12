import { get, writable } from 'svelte/store';
export const socketState = writable(null);
export const socketError = writable(null);
export const socketStates = {
 CONNECTING: 0,
 OPEN: 1,
 CLOSING: 2,
 CLOSED: 3
};
export let url;
const requests = {};
let socket;
let socketCloseCallback = null;

export function setSocketCloseCallback(callback) {
 socketCloseCallback = callback;
}

export function connect(server = null) {
 socketError.set(null);
 if (socket && get(socketState) !== socketStates.CLOSED) {
  console.error('Socket is already connected');
  return;
 }
 if (server) url = server;
 try {
  socket = new WebSocket(url);
 } catch (e) {
  //console.log('Error while creating WebSocket:', e);
  socketError.set('Error while creating WebSocket: ' + e.message);
  return;
 }
 socketState.set(socket.readyState);
 socket.onopen = () => socketState.set(socket.readyState);
 socket.onerror = event => {
  //console.log('sockerr', event);
  socketState.set(socket.readyState);
  socketError.set('Error while connecting to server.');
 };
 socket.onclose = () => {
  socketState.set(socket.readyState);
  if (socketCloseCallback) socketCloseCallback();
 };
 socket.onmessage = event => handleResponse(JSON.parse(event.data));
}

export function disconnect() {
 if (!socket) {
  console.error('Socket is not yet created');
  return;
 }
 //console.log('Socket state:', get(socketState));
 if (get(socketState) !== socketStates.OPEN) {
  console.error('Socket is not opened');
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
 const req = {
  target: 'core',
  requestID
 };
 if (sessionID) req.sessionID = sessionID;
 if (command || params) req.data = {};
 if (command) req.data.command = command;
 if (params) req.data.params = params;
 requests[requestID] = { req, callback };
 socket.send(JSON.stringify(req));
}

function handleResponse(res) {
 //console.log('RESPONSE', res);
 if (res.requestID) {
  const reqData = requests[res.requestID];
  if (reqData.callback) reqData.callback(reqData.req, res);
  delete requests[res.requestID];
 } else console.log('Unknown requestID from server');
}

function getRandomString(length = 40) {
 let result = '';
 while (result.length < length) result += Math.random().toString(36).substring(2);
 return result.substring(0, length);
}

export default {
 socketState,
 socketStates,
 socketError,
 setSocketCloseCallback,
 connect,
 disconnect,
 send,
 url
};
