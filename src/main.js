import App from './App.svelte';

const defaultConfig = Object.freeze({ project: undefined, widgetUrl: undefined, autoInit: false });

let app;

export function init() {
  if (app) {
    console.info('[Livetag] Already initialized.');

    return;
  }

  const config = Object.assign({}, defaultConfig, window.LivetagConfig);

  if (!config.project || typeof config.project !== 'string') {
    console.error(
      '[Livetag] Incorrect "LivetagConfig". Property "project" cannot be blank and must be of type string.'
    );

    return;
  }

  if (!config.widgetUrl || typeof config.widgetUrl !== 'string') {
    console.error(
      '[Livetag] Incorrect "LivetagConfig". Property "widgetUrl" cannot be blank and must be of type string.'
    );

    return;
  }

  app = new App({
    target: document.body,
    props: {
      shopId: String(config.project),
      widgetUrl: String(config.widgetUrl),
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
if (window.LivetagConfig != null && window.LivetagConfig.autoInit) {
  init();
}
