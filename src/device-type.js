import Bowser from 'bowser';

const browser = Bowser.parse(window.navigator.userAgent);

export const isMobileBrowser = () => browser.platform.type === 'mobile' || window.innerWidth <= 512;
export const isDesktopBrowser = () => browser.platform.type === 'desktop' || window.innerWidth > 512;
