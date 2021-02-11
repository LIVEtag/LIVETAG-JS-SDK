import { init, open, close, minimize, maximize, destroy, onAddToCart, onViewProduct, onCheckout } from './main';

const Livetag = Object.freeze({
  init,
  open,
  close,
  minimize,
  maximize,
  destroy,
  onAddToCart,
  onViewProduct,
  onCheckout,
});
window.Livetag = Livetag;

/**
 * @param {string | function | object} method
 * @param {object | undefined} params
 */
function initLivetag(method, params) {
  if (method == null) {
    return;
  }

  if (typeof method === 'function') {
    method(Livetag);
  } else if (typeof method === 'object' && method.projectId) {
    init(method);
  } else if (typeof method === 'string' && Livetag[method]) {
    Livetag[method](params);
  }
}

if ('initLivetag' in window && typeof window.initLivetag === 'function' && initLivetag !== window.initLivetag) {
  const queue = window.initLivetag && window.initLivetag.q ? window.initLivetag.q : [];

  for (const item of queue) {
    try {
      initLivetag(item[0], item[1]);
    } catch (e) {
      console.log(e);
    }
  }

  window.initLivetag = initLivetag;
}
