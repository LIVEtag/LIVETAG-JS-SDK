const prefix = 'livetag';

export const SIGNAL_INIT = `${prefix}/init`;
export const SIGNAL_READY = `${prefix}/ready`;
export const SIGNAL_CLOSE = `${prefix}/close`;
export const SIGNAL_MINIMIZE = `${prefix}/minimize`;
export const SIGNAL_RESTORE = `${prefix}/restore`;
export const SIGNAL_PRODUCT_ADD_TO_CART = `${prefix}/product/addToCart`;
export const SIGNAL_PRODUCT_VIEW = `${prefix}/product/view`;
export const SIGNAL_CHECKOUT = `${prefix}/checkout`;

export const createSignal = (type, payload = null) => ({ type, payload });
