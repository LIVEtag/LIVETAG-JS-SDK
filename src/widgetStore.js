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

const widgetStore = writable(Object.assign({}, initialState, storage.get('widget', initialState)));

export const widget = {
  set(value) {
    widgetStore.set({
      ...value,
      open: value.minimized ? value.open : false,
      translate: value.minimized ? value.translate : null,
    });
  },
  update(updater) {
    widgetStore.update(updater);
  },
  getState(fn) {
    const state = get(widgetStore);
    fn(state);
  },
};

//
// Persist state to localStorage
//
widgetStore.subscribe((value) => {
  storage.set('widget', value);
});
