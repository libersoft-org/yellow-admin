import { writable } from 'svelte/store';
import Socket from './socket.js';
export const hideSidebarMobile = writable(false);
export const isLoggedIn = writable(false);
export const loginError = writable(null);
export let userAddress = null;
export let sessionID = null;

export function login(credentials) {
 Socket.send('admin_login', { username: credentials.address, password: credentials.password }, null, (req, res) => {
  if (res.error !== 0) {
   loginError.set(res.message);
   return;
  }
  loginError.set(null);
  userAddress = credentials.address;
  sessionID = res.data.sessionID;
  isLoggedIn.set(true);
 });
}

export function logout() {
 hideSidebarMobile.set(false);
 isLoggedIn.set(false);
 loginError.set(null);
 userAddress = null;
 sessionID = null;
}

function sysInfo() {
 Socket.send('admin_sysinfo', null, sessionID, (req, res) => {
  return res;
 });
}

export default { hideSidebarMobile, isLoggedIn, loginError, userAddress, sessionID, login, logout, sysInfo };
