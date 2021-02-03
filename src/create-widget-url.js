export const createWidgetUrl = (widgetUrl, shopId, { uid, isDesktop = true, sessionId = null }) =>
  `${widgetUrl}/${shopId}?uid=${uid}&sessionId=${sessionId || ''}&isDesktop=${+isDesktop}`;
