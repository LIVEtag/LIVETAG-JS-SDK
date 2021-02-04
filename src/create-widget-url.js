export const createWidgetUrl = (widgetUrl, shopId, { uid, isDesktop = true, sessionId = null, shopUrl = '' }) =>
  `${widgetUrl}/${shopId}?uid=${uid}&sessionId=${sessionId || ''}&isDesktop=${+isDesktop}&shopUrl=${shopUrl}`;
