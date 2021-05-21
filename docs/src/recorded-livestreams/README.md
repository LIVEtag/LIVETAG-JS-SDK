# Recorded Livestreams

Every livestream is automatically recorded, so there are a few simple steps to show the recorded livestream to your visitors:
1. Log in to the admin panel using your shop access details.
1. Find the necessary livestream on the **Livestreams** page.
2. Go to livestream details.
4. Copy the code from the **Integration snippet**.
5. Paste copied code into preferred place on the shop website. For example:
```html
<button type="button" data-livetag="{sessionId}">Watch recorded livestream</button>
```
Where `{sessionId}` is the ID of the recorded livestream which is preset in the snippet.

----

Instead of a button you can use any HTML element, as long as it has the `data-livetag="{sessionId}"` attribute. Clicking on this element will open the widget with the recorded livestream.
For example:
```html
<div class="livestream" data-livetag="{sessionId}">
  <img class="livestream__cover" src="https://via.placeholder.com/200x350" alt="Livestream Title" width="200" height="350" />
  <h4 class="livestream__title">Livestream Title</h4>
  <div class="livestream__date">7 May 2021</div>
  <div class="livestream__description">Some description</div>
</div>
```

----

So you can also open a widget with the recorded livestream via SDK instead of the options suggested above. For example:
```js
// Will work in all cases
initLivetag('open', sessionId);
```
If the SDK is already initialized, you can use this method:
```js
Livetag.open(sessionId);
```
Where `sessionId` is the ID of the recorded livestream.

#### Helpful information

- The likes and comments added during the livestream will be displayed on the recording. As well as displayed products.
- Recorded Livestream in the widget is displayed with a "Recorded" label instead of a timer.
