# Integration

## Initialization

Place this snippet in `head` of the document:

```html
<script type="application/javascript">
  (function(l, i, v, e, t, a, g) {
    if ('Livetag' in l) {
      return;
    }

    l.LivetagConfig = {
      projectId: e,
      autoInit: true,
    };

    var s = i.createElement(v);
    s.async = !0;
    s.src = '{APP_SDK_URL}/lib/livetag.js';
    i.body.appendChild(s);
  })(window, document, 'script', '{projectId}');
</script>
```

Replace `{projectId}` with your project id.

[See](../config/README.md) more details about `LivetagConfig`.

## Events

```typescript
interface Product {
  title: string;
  sku: string;
  option: {
    price: number;
    [key: string]: string | number;
  }
}
```

### onAddToCart
```typescript
let unsubscribe = Livetag.onAddToCart((product: Product) => {
  //
});
```

### onViewProduct
```typescript
let unsubscribe = Livetag.onViewProduct((product: Product) => {
  //
});
```

### onCheckout
```typescript
let unsubscribe = Livetag.onCheckout((products: Product[]) => {
  //
});
```
