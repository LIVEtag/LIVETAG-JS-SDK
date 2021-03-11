# Widget SDK

Detailed description of the widget SDK and available methods and events.

## Initialize with ES Modules

An alternative way to initialize the widget with [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#dynamic_module_loading).
```html
<script>
  (function () {
    import('{APP_SDK_URL}/lib/livetag.esm.js').then((Livetag) => {
      Livetag.init({ shopUri: 'REPLACE_WITH_LIVESTREAM_URI' });

      Livetag.onAddToCart(function (product) {
        console.log('User added a product to cart in the widget', product);

        // Here you need to implement logic for adding an item to the site shopping cart
      });
    });
  })();
</script>
```

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
