import { v4 as uuid } from 'uuid';

const key = 'livetag.uid';

export function generateUid() {
  return uuid();
}

export function getUid() {
  return localStorage.getItem(key);
}

export function storeUid(uid) {
  localStorage.setItem(key, uid);
}
