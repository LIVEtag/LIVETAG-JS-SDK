# Widget Setup

## 1. Add script

Place widget initialization snippet in `head` of the document and replace `REPLACE_WITH_LIVESTREAM_URI` with your **Livestream URI** which you can get in the Admin Panel.

```html
<script>
  (function (l, i, v, e, t, a, g) {
    l.initLivetag = l.initLivetag || function () {
      (l.initLivetag.q = l.initLivetag.q || []).push(arguments);

      return l.initLivetag;
    };

    initLivetag({ shopUri: 'REPLACE_WITH_LIVESTREAM_URI' });
    
    // Register Livetag ready callback
    initLivetag(function (livetag) {

      // Register addToCart event handler
      livetag.onAddToCart(function (product) {
        console.log('User added a product to cart in the widget', product);

        //
        // Here you need to implement logic for adding an item to the shopping cart on your website
        //
      });

    });

    a = i.createElement(v);
    a.async = !0;
    a.src = '{APP_SDK_URL}/lib/livetag.js';
    g = i.getElementsByTagName('script')[0];
    g.parentNode.insertBefore(a, g);
  })(window, document, 'script');
</script>
```
[See](../config/README.md) more details about configuration.

## 2. Create button 

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
#### Advanced steps
Check out all the [methods](../sdk/methods.md) and [events](../sdk/events.md) provided by the Livetag SDK.

#### Shopping cart

In order to get products to the shopping cart of your site you need to implement handling of events [onAddToCart](../sdk/events.md#onaddtocart) and/or [onCheckout](../sdk/events.md#oncheckout) from the widget.

#### Recorded Livestreams

See [how to use recorded livestreams](../recorded-livestreams/README.md).
