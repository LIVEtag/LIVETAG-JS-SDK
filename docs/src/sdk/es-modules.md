# Initialize with ES Modules

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
