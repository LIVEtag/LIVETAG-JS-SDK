# Shopify Setup

## 1. [Add script](../setup/README.md#_1-add-script).

## 2. Implement addToCart( ) and/or checkout( ) methods

To have opportunity for widget to add products to shopping cart of you store, methods described below should be
implemented.

### 2.1 Add to cart example

```js
livetag.onAddToCart(function(product) {
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          quantity: product.quantity,
          id: product.option.sku
        }
      ],
    }),
  })
    .then(resp => {
      // In case you want to react somehow to cart changes (i.e. update view),
      // please, implement this logic here
    })
    .catch(error => {
      // Here can be implemented error handling
    });
});
```

See [Product](../sdk/events.md#product-definition) definition.

### 2.2 Checkout example

```js
livetag.onCheckout(function(products) {
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        ...products.map(product => {
          return {
            quantity: product.quantity,
            id: product.option.sku
          }
        })
      ],
    }),
  })
    .then(resp => {
      // In case you want to react somehow to cart changes (i.e. update view) or navigate to checkout page,
      // please, implement this logic here
    })
    .catch(error => {
      // Here can be implemented error handling
    });
});
```

See [Product](../sdk/events.md#product-definition) definition.

## 3. [Create button](../setup/README.md#_2-create-button).
