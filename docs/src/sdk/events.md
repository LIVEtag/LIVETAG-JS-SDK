# Events

Detailed description of the widget SDK available events.

### Product definition
```typescript
interface Product {
  externalId: string;
  title: string;
  link: string;
  photo: string;
  quantity: number;
  option: {
    sku: string;
    price: number;
    option: string;
  }
}
```

Product example:
```js
const product = {
  externalId: '2',
  title: 'Product 2',
  link: 'https://www.amazon.com/Product-2/dp/4FSSYE8UZF/',
  photo: 'https://i.etsystatic.com/21160692/r/il/a1f7ab/2871882391/il_794xN.2871882391_dm4p.jpg',
  quantity: 1,
  option: {
    sku: '0ef9a862-afbd-473b-b0ec-808903e196c1',
    price: '509.3',
    option: 'Black - M'
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
