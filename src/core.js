import {get, writable} from 'svelte/store';
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
  //console.log('Session ID:', sessionID);
  isLoggedIn.set(true);
 });
}

export function logout() {
 sessionsDel(sessionID, (res) => {
  //console.log('logout Response:', res);
  if (res.error !== 0) {
   alert(res.message);
  }
  frontend_logout();
 }
 );
 sessionID = null;
}

function frontend_logout() {
 Socket.setSocketCloseCallback(() =>
 {
  //console.log('in SocketCloseCallback: Socket state:', get(Socket.socketState));
  hideSidebarMobile.set(false);
  isLoggedIn.set(false);
  loginError.set(null);
  username = null;
  sessionID = null;
 });
 Socket.disconnect();
}

function send(command, params, callback)
{
 let res = Socket.send(command, params, sessionID, (req, res) => {
  //console.log('Response:', res);

  if (res.error >= 900 && res.error <= 999) {
   console.error('Error:', res.error);
  }
  if (res.error === 997) {
   frontend_logout();
   return;
  }
  if (res.error >= 900 && res.error <= 999) {
   return;
  }

  callback(res);
 });
}

export function sysInfoList(callback = null) {
 send('admin_sysinfo', null, sessionID, callback);
}

export function domainsList(callback = null, count = 10, lastID = 0, filterName = null) {
 const params = { count, lastID };
 if (filterName) params.filterName = filterName;
 send('admin_list_domains', params, callback);
}

export function domainsAdd(name, callback = null) {
 send('admin_add_domain', { name }, callback);
}

export function domainsEdit(id, name, callback = null) {
 send('admin_edit_domain', { domainID: id, name }, callback);
}

export function domainsDel(id, callback = null) {
 send('admin_del_domain', { domainID: id }, callback);
}

export function domainInfo(id, callback = null) {
 send('admin_info_domain', { domainID: id }, callback);
}

export function sessionsDel(id, callback = null) {
 send('admin_del_session', { sessionID: id }, callback);
}

export function humanSize(bytes, decimals = 2) {
 if (bytes === 0) return '0 B';
 const k = 1024;
 const dm = decimals < 0 ? 0 : decimals;
 const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default {
 hideSidebarMobile,
 isLoggedIn,
 loginError,
 username,
 sessionID,
 logout
};
