# Events

Detailed description of the widget SDK available events.

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
