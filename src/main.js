import App from './App.svelte';
import { EVENT_READY, EVENT_CHECKOUT, EVENT_ADD_TO_CART, EVENT_VIEW_PRODUCT } from './events';
import { clearWidgetPersistStore } from './widgetStore';

let app;

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

const listen = (fn) => ({ detail }) => fn(detail);

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

export let onReady = maybeApp((listener) => app.$on(EVENT_READY, listen(listener)));
export let onAddToCart = maybeApp((listener) => app.$on(EVENT_ADD_TO_CART, listen(listener)));
export let onViewProduct = maybeApp((listener) => app.$on(EVENT_VIEW_PRODUCT, listen(listener)));
export let onCheckout = maybeApp((listener) => app.$on(EVENT_CHECKOUT, listen(listener)));

export const destroy = maybeApp(() => {
  app.$destroy();
  app = undefined;
  removeListeners();
  clearWidgetPersistStore();

  console.error('[Livetag] Destroyed.');
});

function initError() {
  console.error('[Livetag] Call "Livetag.init()" first.');
}

/**
 * @param {{ shopUri: string }} params
 * @return {void}
 */
export function init(params) {
  if (app) {
    console.error('[Livetag] Livetag already initialized.');

    return;
  }

  if (params == null || typeof params !== 'object') {
    console.error('[Livetag] Incorrect params. "params" cannot be blank and must be of type object.');

    return;
  }

  if (!params.shopUri || typeof params.shopUri !== 'string') {
    console.error('[Livetag] Incorrect "params.shopUri". "params.shopUri" cannot be blank and must be of type string.');

    return;
  }

  try {
    const target =
      document.getElementById('livetag') ||
      (() => {
        const div = document.createElement('div');
        div.setAttribute('id', 'livetag');
        document.body.appendChild(div);

        return div;
      })();

    app = new App({
      target,
      props: {
        shopUri: String(params.shopUri),
        widgetUrl: process.env.APP_WIDGET_URL,
      },
    });

    registerListener();

    console.log('[Livetag] Initialized.');
  } catch (e) {
    console.log('[Livetag] Error initialization', e);
  }
}
