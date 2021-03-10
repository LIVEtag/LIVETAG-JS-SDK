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

    initLivetag({ shopUri: '{shopUri}' });
    // Register Livetag ready callback function
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

      Livetag.init({ shopUri: '{shopUri}' });
    });
  })();
</script>
```

Replace `{shopUri}` with your Shop URI.

Next, you need to add a button to launch the widget. There are two options:
1. Add a button to the required place on the site with the `data-livetag` attribute. For example:
   ```html
   <button type="button" data-livetag>Watch Now</button>
   ```
   Clicking on such a button will automatically start the widget. This is the easiest way.
2. After SDK initialized, programmatically add a click event listener on any element on which the widget will be started. For example:
    ```js
    initLivetag(function (livetag) {
      document.querySelector('#some-button').addEventListener('click', () => {
        livetag.open();
      });
    });
    ```

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

### Product definition
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

See [Product](#product-definition) definition.

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
