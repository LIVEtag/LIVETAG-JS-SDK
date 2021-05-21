# Scheduled Livestreams

Scheduled livestreams are livestreams that are scheduled to start at a certain time.

Scheduled livestream may contain a cover image or video that will be displayed before you start the show.

You can schedule the livestream through the admin panel.

To create a scheduled livestream you need to do the following simple steps:
1. Log in to the admin panel using your shop access details.
2. Create the livestream on the **Livestreams** page:
   - Specify the name of livestream.
   - Select start date and time.
   - Select the necessary duration.
   - Upload cover image or video. Recommended aspect ratio is 9/16 (portrait orientation). For example, 720x1280px.
   - Select products.
2. Go to livestream details.
4. Copy the code from the **Integration snippet**.
5. Paste copied code into preferred place on the shop website. For example:
```html
<button type="button" data-livetag="{sessionId}">Watch scheduled livestream</button>
```
Where `{sessionId}` is the ID of the scheduled livestream which is preset in the snippet.

----

Instead of a button you can use any HTML element, as long as it has the `data-livetag="{sessionId}"` attribute. Clicking on this element will open the widget with the scheduled livestream. For example:
```html
<div class="livestream" data-livetag="{sessionId}">
  <img class="livestream__cover" src="https://via.placeholder.com/200x350" alt="Livestream Title" width="200" height="350" />
  <h4 class="livestream__title">Scheduled Livestream Title</h4>
  <div class="livestream__date">7 May 2021</div>
  <div class="livestream__description">Scheduled Livestream details</div>
</div>
```
