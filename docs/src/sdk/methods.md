# Methods

Detailed description of the widget SDK available methods.

### init
Init Livetag SDK.
```js
Livetag.init(config);
```
See [config](../config/README.md).

### open
Open widget.
```js
Livetag.open();

// or

Livetag.open({ sessionId });
```
Where `sessionId` (optional) id of the live stream session.
If `sessionId` is not specified, the widget will connect to the current active live stream session.

### close
Close opened widget.
```js
Livetag.close();
```

### destroy
Close the widget, destroy the application SDK instance and deregister event listeners. You must use the [init](#init) method to re-initialize.
```js
Livetag.destroy();
```

### minimize
Minimize opened widget or open widget in minimized mode.
```js
Livetag.minimize();
```

### maximize
Maximize minimized widget or open widget in standard mode.
```js
Livetag.maximize();
```
