import { writable, get } from 'svelte/store';

const storage = {
  prefix: 'livetag.',
  get(key, defaultValue) {
    try {
      return JSON.parse(localStorage.getItem(`${this.prefix}${key}`)) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
  },
};

const initialState = {
  open: false,
  minimized: false,
  translate: null,
  sessionId: null,
};

export const widget = writable(Object.assign({}, initialState, storage.get('widget', initialState)));

export const getState = (store, fn) => {
  const state = get(store);

  fn(state);
};

//
// Persist state to localStorage
//
widget.subscribe((value) => {
  storage.set('widget', value);
});
