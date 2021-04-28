import mobile from 'is-mobile';

export function isTouchDevice() {
  return mobile({ ua: window.navigator.userAgent, tablet: true });
}
