import { writable } from 'svelte/store';
import Socket from './socket.js';
export const hideSidebarMobile = writable(false);
export const isLoggedIn = writable(false);
export const loginError = writable(null);
export const sysInfo = writable([]);
export const adminsArray = writable([]);
export const domainsArray = writable([]);
export const usersArray = writable([]);
export const sessionsArray = writable([]);
export let username = null;
export let sessionID = null;

export function login(credentials) {
 Socket.send('admin_login', { username: credentials.username, password: credentials.password }, null, (req, res) => {
  if (res.error !== 0) {
   loginError.set(res.message);
   return;
  }
  loginError.set(null);
  username = credentials.username;
  sessionID = res.data.sessionID;
  isLoggedIn.set(true);
 });
}

export function logout() {
 hideSidebarMobile.set(false);
 isLoggedIn.set(false);
 loginError.set(null);
 username = null;
 sessionID = null;
}

export function sysInfoList() {
 Socket.send('admin_sysinfo', null, sessionID, (req, res) => {
  console.log(res);
  //sysInfo = res;
 });
}

export function domainsList() {
 Socket.send('admin_list_domains', { count: 10, offset: 0 }, sessionID, (req, res) => domainsArray.set(res.data.domains));
}

export function domainsAdd(name, callback = null) {
 Socket.send('admin_add_domain', { name }, sessionID, (req, res) => {
  //console.log(res);
  if (callback) callback(res);
 });
}

export default { hideSidebarMobile, isLoggedIn, loginError, username, sessionID, login, logout, sysInfoList, domainsArray, domainsList };
