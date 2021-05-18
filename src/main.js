import App from './App.svelte';
import { EVENT_READY, EVENT_CHECKOUT, EVENT_ADD_TO_CART, EVENT_VIEW_PRODUCT } from './events';
import { isObject } from './is-object';
import { logger } from './logger';
import { clearWidgetPersistStore } from './widget.store';

let app;

const maybeApp = (fn) => (...args) => {
  if (!app) {
    initError();

    return;
  }

  return fn(...args);
};

export const open = maybeApp((sessionId, params = {}) => {
  if (!Number(sessionId)) {
    sessionId = undefined;
  }

  app.$set({
    open: true,
    sessionId,
    shopUrl: window.location.href,
    ...(isObject(params) && 'minimized' in params ? { minimized: Boolean(params.minimized) } : {}),
  });
});

export const close = maybeApp(() => {
  app.$set({ open: false });
});

export const minimize = maybeApp(() => {
  app.$set({ minimized: true });
});

export const maximize = maybeApp(() => {
  app.$set({ minimized: false });
});

const listen = (fn) => ({ detail }) => fn(detail);

export let onReady = maybeApp((listener) => app.$on(EVENT_READY, listen(listener)));
export let onAddToCart = maybeApp((listener) => app.$on(EVENT_ADD_TO_CART, listen(listener)));
export let onViewProduct = maybeApp((listener) => app.$on(EVENT_VIEW_PRODUCT, listen(listener)));
export let onCheckout = maybeApp((listener) => app.$on(EVENT_CHECKOUT, listen(listener)));

function documentClickHandler(e) {
  if (!app) {
    return;
  }

  if (e.target.dataset && 'livetag' in e.target.dataset) {
    open(Number(e.target.dataset.livetag) || null, {
      minimized: 'livetagMinimized' in e.target.dataset,
    });
  }
}

function registerListener() {
  document.addEventListener('click', documentClickHandler, { passive: true });
}

function removeListeners() {
  document.removeEventListener('click', documentClickHandler);
}

export const destroy = maybeApp(() => {
  app.$destroy();
  app = undefined;
  removeListeners();
  clearWidgetPersistStore();

  logger.info('Destroyed.');
});

function initError() {
  logger.error('Call "Livetag.init()" first');
}

function getSharedSessionId() {
  return Number(new URLSearchParams(window.location.search).get('livetag-session-id')) || null;
}

function openShaderSessionIfNeeded({ autoplaySharedSessions } = {}) {
  const sessionId = getSharedSessionId();
  if (sessionId && (typeof autoplaySharedSessions === 'undefined' || autoplaySharedSessions)) {
    open(sessionId);
  }
}

/**
 * @param {{ shopUri: string, autoplaySharedSessions: boolean }} params
 * @return {void}
 */
export function init(params) {
  if (app) {
    logger.error('Already initialized');

    return;
  }

  if (!isObject(params)) {
    logger.error('Config cannot be blank and must be of type object');

    return;
  }

  if (!params.shopUri || typeof params.shopUri !== 'string') {
    logger.error('Property "shopUri" cannot be blank and must be of type string');

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

    //
    // Handle Shared Sessions (Livestreams)
    //
    openShaderSessionIfNeeded(params);

    logger.log('Initialized');
  } catch (e) {
    logger.error('Initialization Error', e);
  }
}
