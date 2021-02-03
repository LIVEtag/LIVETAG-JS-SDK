import App from './App.svelte';

let defaultConfig = { project: undefined, widgetUrl: undefined, autoInit: false };
let config = Object.assign({}, defaultConfig, window.LivetagConfig);
let app;

export function init() {
  if (app) {
    console.info('[Livetag] Already initialized.');

    return;
  }

  app = new App({
    target: document.body,
    props: {
      shopId: config.project,
      widgetUrl: config.widgetUrl,
    },
  });

  registerListener();

  console.log('[Livetag] Initialized.');
}

function documentClickHandler(e) {
  if (!app) {
    return;
  }

  if (e.target.dataset && 'livetag' in e.target.dataset) {
    app.$set({
      open: true,
      minimized: 'livetagMinimized' in e.target.dataset,
      sessionId: +e.target.dataset.livetag || null,
    });
  }
}

const maybeApp = (fn) => (...args) => {
  if (!app) {
    initError();

    return;
  }

  return fn(...args);
};

function registerListener() {
  document.addEventListener('click', documentClickHandler, { passive: true });
}

function removeListeners() {
  document.removeEventListener('click', documentClickHandler);
}

export const open = maybeApp((sessionId, params = {}) => {
  app.$set({
    open: true,
    sessionId,
    minimized: params ? Boolean(params.minimized) : false,
  });
});

export const close = maybeApp(() => {
  app.$set({ open: false });
});

export const minimize = maybeApp(() => {
  app.$set({ minimize: true });
});

export const maximize = maybeApp(() => {
  app.$set({ minimize: false });
});

export let on = maybeApp((eventName, listener) => app.$on(eventName, listener));

export const destroy = maybeApp(() => {
  app.$destroy();
  app = undefined;
  removeListeners();
});

function initError() {
  console.error('[Livetag] Call "Livetag.init()" first.');
}

//
// Initialize Livetag
//
if (config.autoInit) {
  init();
}
