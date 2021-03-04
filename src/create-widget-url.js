export const createWidgetUrl = (widgetUrl, shopUri, { uid, isDesktop = true, sessionId = null, shopUrl = '' }) =>
  `${widgetUrl}/${shopUri}?uid=${uid}&sessionId=${sessionId || ''}&isDesktop=${+isDesktop}&shopUrl=${shopUrl}`;
