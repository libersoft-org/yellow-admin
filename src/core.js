import { writable } from 'svelte/store';
import Socket from './socket.js';
export const hideSidebarMobile = writable(false);
export const isLoggedIn = writable(false);
export const loginError = writable(null);
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

export function sysInfoList(callback = null) {
 Socket.send('admin_sysinfo', null, sessionID, (req, res) => {
  if (callback) callback(res);
 });
}

export function domainsList(callback = null, count = 10, offset = 0) {
 Socket.send('admin_list_domains', { count, offset }, sessionID, (req, res) => {
  if (callback) callback(res);
 });
}

export function domainsAdd(name, callback = null) {
 Socket.send('admin_add_domain', { name }, sessionID, (req, res) => {
  if (callback) callback(res);
 });
}

export function domainsDel(id, callback = null) {
 Socket.send('admin_del_domain', { domainID: id }, sessionID, (req, res) => {
  if (callback) callback(res);
 });
}

export function humanSize(bytes, decimals = 2) {
 if (bytes === 0) return '0 B';
 const k = 1024;
 const dm = decimals < 0 ? 0 : decimals;
 const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default { hideSidebarMobile, isLoggedIn, loginError, username, sessionID, login, logout, sysInfoList, domainsList, humanSize };
