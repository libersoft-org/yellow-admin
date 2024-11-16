import { writable } from 'svelte/store';
import Socket from './socket.js';
export const hideSidebarMobile = writable(false);
export const isLoggedIn = writable(false);
export const loginError = writable(null);
export let username = null;
export let sessionID = null;

Socket.socketError.subscribe(value => {
 console.log('Socket Error:', value);
 if (value) loginError.set(value);
});

export function logout() {
 sessionsDel(sessionID, res => {
  //console.log('logout Response:', res);
  if (res.error !== 0) {
   alert(res.message);
  }
  frontend_logout();
 });
 sessionID = null;
}

function frontend_logout() {
 Socket.setSocketCloseCallback(() => {
  //console.log('in SocketCloseCallback: Socket state:', get(Socket.socketState));
  hideSidebarMobile.set(false);
  isLoggedIn.set(false);
  username = null;
  sessionID = null;
 });
 Socket.disconnect();
}

export function login(credentials) {
 send('admin_login', { username: credentials.username, password: credentials.password }, res => {
  if (res.error !== 0) {
   Socket.disconnect();
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

function send(command, params, callback) {
 Socket.send(command, params, sessionID, async (req, res) => {
  if (res.error >= 900 && res.error <= 999) {
   console.error('Error:', res.error);
  }
  if (res.error === 997 || res.error === 994) {
   frontend_logout();
   return;
  }
  if (res.error >= 900 && res.error <= 999) {
   return;
  }
  await callback(res);
 });
}

export function sysInfoList(callback = null) {
 send('admin_sysinfo', null, callback);
}

export function domainsList(callback = null, count = 10, offset = 0, filterName = null, sortBy = null, sortDir = null) {
 const params = { count, offset, orderBy: sortBy, direction: sortDir };
 if (filterName) params.filterName = filterName;
 send('admin_domains_list', params, callback);
}

export function domainsAdd(name, callback = null) {
 send('admin_domains_add', { name }, callback);
}

export function domainsEdit(id, name, callback = null) {
 send('admin_domains_edit', { domainID: id, name }, callback);
}

export function domainsDel(id, callback = null) {
 send('admin_domains_del', { domainID: id }, callback);
}

export function domainInfo(id, callback = null) {
 send('admin_domains_info', { domainID: id }, callback);
}

export function adminsList(callback = null, count = 10, offset = 0, filterName = null, sortBy = null, sortDir = null) {
 const params = { count, offset, orderBy: sortBy, direction: sortDir };
 if (filterName) params.filterName = filterName;
 send('admin_admins_list', params, callback);
}

export function adminsAdd(username, password, callback = null) {
 send('admin_admins_add', { username, password }, callback);
}

export function adminsEdit(id, username, password, callback = null) {
 send('admin_admins_edit', { adminID: id, username, password }, callback);
}

export function adminsDel(id, callback = null) {
 send('admin_admins_del', { adminID: id }, callback);
}

export function adminInfo(id, callback = null) {
 send('admin_admins_info', { adminID: id }, callback);
}

export function usersList(callback = null, count = 10, offset = 0, filters, sortBy = null, sortDir = null) {
 const params = { count, offset, orderBy: sortBy, direction: sortDir };
 if (filters.username) params.filterUsername = filters.username;
 if (filters.domainID) params.filterDomainID = filters.domainID;
 send('admin_users_list', params, callback);
}

export function usersAdd(username, domainID, visible_name, password, callback = null) {
 send('admin_users_add', { username, domainID, visible_name, password }, callback);
}

export function usersEdit(id, username, domainID, visible_name, password, callback = null) {
 send('admin_users_edit', { userID: id, username, domainID, visible_name, password }, callback);
}

export function usersDel(id, callback = null) {
 send('admin_users_del', { userID: id }, callback);
}

export function userInfo(id, callback = null) {
 send('admin_users_info', { userID: id }, callback);
}

export function modulesList(callback = null, count = 10, offset = 0, filterName = null, sortBy = null, sortDir = null) {
 const params = { count, offset, orderBy: sortBy, direction: sortDir };
 if (filterName) params.filterName = filterName;
 send('admin_modules_list', params, callback);
}

export function modulesAdd(name, connection_string, callback = null) {
 send('admin_modules_add', { name, connection_string }, callback);
}

export function modulesEdit(id, name, connection_string, callback = null) {
 send('admin_modules_edit', { moduleID: id, name, connection_string }, callback);
}

export function modulesDel(id, callback = null) {
 send('admin_modules_del', { moduleID: id }, callback);
}

export function modulesInfo(id, callback = null) {
 send('admin_modules_info', { moduleID: id }, callback);
}

export function sessionsList(callback = null, count = 10, offset = 0, filterName = null, sortBy = null, sortDir = null) {
 const params = { count, offset, orderBy: sortBy, direction: sortDir };
 if (filterName) params.filterName = filterName;
 send('admin_sessions_list', params, callback);
}

export function sessionsDel(id, callback = null) {
 send('admin_sessions_del', { sessionID: id }, callback);
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
