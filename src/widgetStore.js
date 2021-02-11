import { writable, get } from 'svelte/store';

const storage = {
  prefix: 'livetag.',
  store: sessionStorage,
  get(key, defaultValue) {
    try {
      return JSON.parse(this.store.getItem(`${this.prefix}${key}`)) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    this.store.setItem(`${this.prefix}${key}`, JSON.stringify(value));
  },
  clear(key) {
    this.store.removeItem(`${this.prefix}${key}`);
  }
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

export const clearWidgetPersistStore = () => {
  storage.clear('widget');
};

//
// Persist state to storage
//
widgetStore.subscribe((value) => {
  storage.set('widget', value);
});
