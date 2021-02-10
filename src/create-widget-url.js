export const createWidgetUrl = (widgetUrl, projectId, { uid, isDesktop = true, sessionId = null, shopUrl = '' }) =>
  `${widgetUrl}/${projectId}?uid=${uid}&sessionId=${sessionId || ''}&isDesktop=${+isDesktop}&shopUrl=${shopUrl}`;
