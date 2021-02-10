import App, { EVENT_ADD_TO_CART, EVENT_VIEW_PRODUCT, EVENT_CHECKOUT } from './App.svelte';

const defaultConfig = Object.freeze({ projectId: undefined, autoInit: false });

let app;

export function init() {
  if (app) {
    console.info('[Livetag] Already initialized.');

    return;
  }

  const config = Object.assign({}, defaultConfig, window.LivetagConfig);

  if (!config.projectId || typeof config.projectId !== 'string') {
    console.error(
      '[Livetag] Incorrect "LivetagConfig". Property "projectId" cannot be blank and must be of type string.'
    );

    return;
  }

  app = new App({
    target: document.body,
    props: {
      projectId: String(config.projectId),
      widgetUrl: process.env.APP_WIDGET_URL,
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

export let onAddToCart = maybeApp((listener) => app.$on(EVENT_ADD_TO_CART, listener));
export let onViewProduct = maybeApp((listener) => app.$on(EVENT_VIEW_PRODUCT, listener));
export let onCheckout = maybeApp((listener) => app.$on(EVENT_CHECKOUT, listener));

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
