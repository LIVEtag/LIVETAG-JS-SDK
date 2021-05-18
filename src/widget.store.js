import { get, writable } from 'svelte/store';
import { isObject } from './is-object';
import { storage } from './storage';

const createInitialState = () => {
  const initialState = {
    open: false,
    minimized: false,
    translate: null,
    sessionId: null,
    shopUrl: null,
  };
  const savedState = storage.get('widget');

  if (savedState == null || typeof savedState !== 'object') {
    return initialState;
  }

  const { open, minimized, translate, sessionId, shopUrl } = savedState;

  return {
    open: typeof open === 'boolean' ? open : initialState.open,
    minimized: typeof minimized === 'boolean' ? minimized : initialState.minimized,
    translate: isObject(translate) ? { x: translate.x || null, y: translate.y || null } : initialState.translate,
    sessionId: typeof sessionId === 'string' ? sessionId : initialState.sessionId,
    shopUrl: typeof shopUrl === 'string' && shopUrl.startsWith(window.location.origin) ? shopUrl : window.location.href,
  };
};

const widgetStore = writable(createInitialState());

export const widget = {
  set(value) {
    this.update((state) => ({
      ...state,
      ...value,
      open: value.open,
      minimized: value.minimized || value.open,
      translate: value.minimized ? value.translate : null,
    }));
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
