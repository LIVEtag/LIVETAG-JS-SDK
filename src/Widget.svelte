<script>
  import { onMount } from 'svelte';
  import { createWidgetUrl } from './create-widget-url';
  import { isMobileBrowser } from './device-type';
  import { createSignal, SIGNAL_INIT, SIGNAL_READY } from './signal';

  export let params = {
    widgetUrl: '',
    shopUri: '',
    shopUrl: '',
    uid: '',
    sessionId: '',
  };
  export let ready = false;
  export let timeout = 30000;
  export let onLoad = (port) => undefined;
  export let onSignal = (event) => undefined;
  export let onError = () => undefined;

  let src;
  $: src = createWidgetUrl(params.widgetUrl, params.shopUri, {
    uid: params.uid,
    sessionId: params.sessionId,
    shopUrl: params.shopUrl,
    isDesktop: !isMobileBrowser(),
  });
  $: origin = new URL(src).origin;

  let timeoutId;
  let onMessage;

  onMount(() => {
    timeoutId = setTimeout(() => {
      onError();
    }, timeout);

    return () => {
      clearTimeout(timeoutId);

      removeOnMessageListener();
    };
  });

  function removeOnMessageListener() {
    window.removeEventListener('message', onMessage);
    onMessage = undefined;
  }

  function registerOnMessageListener(frame, channel) {
    onMessage = function (e) {
      if (e.origin === origin && e.data === 'loaded') {
        frame.postMessage(createSignal(SIGNAL_INIT), origin, [channel.port2]);

        onLoad(channel.port1);

        removeOnMessageListener();
      }
    };

    window.addEventListener('message', onMessage);
  }

  function handleLoad({ target: { contentWindow } }) {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event && event.data && event.data.type === SIGNAL_READY) {
        clearTimeout(timeoutId);
        onSignal(event);
      }

      channel.port1.onmessage = onSignal;
    };

    registerOnMessageListener(contentWindow, channel);
  }
</script>

<iframe
  title="Livetag"
  class="livetag__iframe"
  class:livetag__iframe--ready={ready}
  {src}
  on:load={handleLoad}
  allow="autoplay; clipboard-write"
  allowtransparency="true"
/>

<style>
  .livetag__iframe {
    width: 100% !important;
    height: 100% !important;
    opacity: 0 !important;
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    position: relative !important;
    top: initial !important;
    left: initial !important;
    right: initial !important;
    bottom: initial !important;
    box-sizing: border-box !important;
    transition: opacity 0.2s ease-out !important;
    pointer-events: none !important;
    z-index: 1 !important;
    overflow: hidden !important;
  }

  .livetag__iframe--ready {
    opacity: 1 !important;
    transition: opacity 0.2s ease-in !important;
    pointer-events: initial !important;
  }
</style>
