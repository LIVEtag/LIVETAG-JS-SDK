# Integration

## Initialization

Place this snippet in `head` of the document:

```html
<script>
  (function (l, i, v, e, t, a, g) {
    l.initLivetag = l.initLivetag || function () {
      (l.initLivetag.q = l.initLivetag.q || []).push(arguments);

      return l.initLivetag;
    };

    initLivetag({ projectId: '{projectId}' });
    initLivetag(function (livetag) {
      // Livetag SDK is loaded
      console.log('[Livetag] Loaded.');
    });

    a = i.createElement(v);
    a.async = !0;
    a.src = '{APP_SDK_URL}/lib/livetag.js';
    g = i.getElementsByTagName('script')[0];
    g.parentNode.insertBefore(a, g);
  })(window, document, 'script');
</script>
```

ES Modules.
Preferred better way to load and initialize Livetag SDK.
```html
<script>
  (function () {
    import('{APP_SDK_URL}/lib/livetag.esm.js').then((Livetag) => {
      // Use Livetag methods
      console.log('[Livetag]', Livetag);

      Livetag.init({ projectId: '{projectId}' });
    });
  })();
</script>
```

Replace `{projectId}` with your project id.

[See](../config/README.md) more details about configuration.

## Methods

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
Closes the widget, destroys the application SDK instance and deregisters event listeners. You must use the [init](#init) method to re-initialize.
```js
Livetag.destroy();
```

### minimize
Minimize opened widget or opens widget in minimized mode.
```js
Livetag.minimize();
```

### maximize
Maximize minimized widget or opens widget in standard mode.
```js
Livetag.maximize();
```

## Events

```typescript
interface Product {
  externalId: string;
  title: string;
  link: string;
  photo: string;
  option: {
    sku: string;
    price: number;
    [key: string]: string;
  }
}
```

### onReady
Triggers when the widget (☝️not SDK) is open and ready to operate.
```typescript
let unsubscribe = Livetag.onReady(() => {
  //
});

// If necessary, call later to unsubscribe from events
unsubscribe();
```

### onAddToCart
Triggered when user clicks the "Add to cart" button of the selected product.
```typescript
let unsubscribe = Livetag.onAddToCart((product: Product) => {
  //
});

// If necessary, call later to unsubscribe from events
unsubscribe();
```

### onViewProduct

```typescript
let unsubscribe = Livetag.onViewProduct((product: Product) => {
  //
});

// If necessary, call later to unsubscribe from events
unsubscribe();
```

### onCheckout

```typescript
let unsubscribe = Livetag.onCheckout((products: Product[]) => {
  //
});

// If necessary, call later to unsubscribe from events
unsubscribe();
```
