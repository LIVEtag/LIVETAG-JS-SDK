# Share Livestream

The buyer is able to share the livestream. To do this, the widget has a Share button.

The buyer can share both a direct link to the livestream and on Facebook directly from the widget.

Clicking on this link will automatically open the widget with the shared livestream. To disable automatically opening shared livestream, just add parameter `autoplaySharedSessions: false` in the initialization script (see [Config](../config/README.md#autoplaysharedsessions)).

Each such shared livestream link contains the URL query parameter `livetag-session-id`. For example
```
https://my-store.com/page?livetag-session-id=1
```

You can read this parameter yourself and get information on this show or open the widget manually, for example:
```javascript
const searchParams = new URLSearchParams(window.location.search);
const sessionId = searchParams.get('livetag-session-id');

Livetag.open(sessionId);
```
