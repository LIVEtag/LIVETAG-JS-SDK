<script>
  import { afterUpdate, beforeUpdate, createEventDispatcher } from 'svelte';
  import { createWidgetUrl } from './create-widget-url';
  import { debounce } from './debounce';
  import { isDesktopBrowser, isMobileBrowser } from './device-type';
  import { drag } from './draggable';
  import Loader from './Loader.svelte';
  import {
    createSignal,
    SIGNAL_CHECKOUT,
    SIGNAL_CLOSE,
    SIGNAL_IS_MOBILE,
    SIGNAL_MINIMIZE,
    SIGNAL_PRODUCT_ADD_TO_CART,
    SIGNAL_PRODUCT_VIEW,
    SIGNAL_READY,
    SIGNAL_RESTORE,
  } from './signal';
  import { EVENT_READY, EVENT_CHECKOUT, EVENT_ADD_TO_CART, EVENT_VIEW_PRODUCT } from './events';
  import { generateUid, getUid, storeUid } from './uid';
  import Widget from './Widget.svelte';
  import CloseBtn from './CloseBtn.svelte';
  import MaximizeBtn from './MaximizeBtn.svelte';
  import { widget } from './widgetStore';

  let uid = getUid() || generateUid();
  storeUid(uid);

  let dispatch = createEventDispatcher();

  let port;
  let loadingError = false;

  //
  // Shop props
  //
  export let projectId;
  export let widgetUrl;
  export let sessionId = null;

  let isDesktop = isDesktopBrowser();
  let isMobile = isMobileBrowser();

  //
  // Widget state props
  //
  export let open = false;
  export let minimized = false;

  let src;
  let ready = false;
  let translate = null;

  let translateStyle;
  $: translateStyle =
    minimized && translate && (translate.x || translate.y)
      ? `translate3d(${translate.x || 0}px, ${translate.y || 0}px, 0)`
      : 'initial';

  const onResize = debounce(
    () => {
      isDesktop = isDesktopBrowser();
      isMobile = isMobileBrowser();

      signal(SIGNAL_IS_MOBILE, isMobile);
    },
    200,
    false
  );

  $: if (open) {
    window.addEventListener('resize', onResize);
  } else {
    window.removeEventListener('resize', onResize);
  }

  beforeUpdate(() => {
    if (!open && loadingError) {
      loadingError = false;
    }

    if (!open) {
      src = undefined;
    }

    if (open && !src) {
      src = createWidgetUrl(widgetUrl, projectId, { uid, sessionId, isDesktop, shopUrl: window.location.href });
    }
  });

  afterUpdate(() => {
    signal(SIGNAL_MINIMIZE, minimized);

    widget.set({ open, minimized, sessionId, translate });
  });

  //
  // Get initial state data and unsubscribe from store
  //
  widget.getState((state) => {
    open = state.open;
    minimized = state.minimized;
    sessionId = state.sessionId;
    translate = state.translate;
  });

  function close() {
    open = false;
    ready = false;
    minimized = false;
    translate = null;
  }

  function minimize() {
    minimized = true;
    translate = null;
  }

  function restore() {
    minimized = false;
    translate = null;
  }

  const signalHandlers = {
    [SIGNAL_READY]: () => {
      ready = true;

      dispatch(EVENT_READY);

      signal(SIGNAL_MINIMIZE, minimized);
      signal(SIGNAL_IS_MOBILE, isMobile);
    },
    [SIGNAL_MINIMIZE]: () => {
      minimize();
    },
    [SIGNAL_CLOSE]: () => {
      close();
    },
    [SIGNAL_RESTORE]: () => {
      restore();

      signal(SIGNAL_MINIMIZE, minimized);
    },
    [SIGNAL_PRODUCT_ADD_TO_CART]: (event, data) => {
      dispatch(EVENT_ADD_TO_CART, data);
    },
    [SIGNAL_PRODUCT_VIEW]: (event, data) => {
      dispatch(EVENT_VIEW_PRODUCT, data);
    },
    [SIGNAL_CHECKOUT]: (event, data) => {
      dispatch(EVENT_CHECKOUT, data);
    },
  };

  function signal(type, payload = null) {
    if (port) {
      port.postMessage(createSignal(type, payload));
    }
  }

  function onSignal(event) {
    const { data } = event;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Livetag] Signal', data);
    }

    if (signalHandlers[data.type]) {
      signalHandlers[data.type](event, data.payload);
    }
  }

  function onLoad(messagePort) {
    port = messagePort;
  }

  function onError() {
    loadingError = true;
  }

  function onDragEnd({ detail: { x, y } }) {
    if (!x && !y) {
      translate = null;
    } else if (translate === null || translate.x !== x || translate.y !== y) {
      translate = { x, y };
    }
  }
</script>

<div id="livetag">
  {#if open}
    <div
      class="livetag__box"
      class:livetag__box--minimized={minimized}
      class:livetag__box--mobile={isMobile}
      style="transform: {translateStyle}"
      use:drag={minimized}
      on:drag-end={onDragEnd}
    >
      {#if !ready && !loadingError}
        <Loader />
      {/if}

      {#if loadingError}
        <div class="livetag__error" on:click={close}>
          Live session cannot be loaded.
          <br />
          Please, try again.
        </div>
      {:else}
        <Widget {src} {ready} {onLoad} {onSignal} {onError} />
      {/if}

      {#if minimized}
        <div class="livetag__overlay" />

        <div class="livetag__btns">
          <MaximizeBtn class="livetag__btn" on:click={restore} />

          <CloseBtn class="livetag__btn" on:click={close} />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :root {
    --livetag-loader-size: 48px;
    --livetag-widget-width--minimized: 240px;
    --livetag-widget-height--minimized: calc(var(--livetag-widget-width--minimized) * 1.6);
  }

  .livetag__btns {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

  :global(.livetag__btn) {
    border: none;
    background-color: rgba(0, 0, 0, 0.35);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #fff;
    font-size: 32px;
    line-height: 0;
    padding: 0;
    cursor: pointer;
  }

  .livetag__error {
    display: flex;
    place-content: center;
    place-items: center;
    height: 100%;
    color: #fff;
    text-align: center;
    font-size: 2em;
    line-height: 1;
  }

  .livetag__box--minimized .livetag__error {
    font-size: 1em;
  }

  .livetag__box--mobile .livetag__error {
    padding: 0.5em;
  }

  .livetag__box {
    background-color: rgba(0, 0, 0, 0.55);
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    z-index: 2147483647;
    will-change: transform;
  }

  .livetag__box--minimized {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 10px;
    user-select: none;
    line-height: 0;
    width: var(--livetag-widget-width--minimized);
    height: var(--livetag-widget-height--minimized);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11),
      0 6px 8px rgba(0, 0, 0, 0.11), 0 8px 16px rgba(0, 0, 0, 0.11);
    border-radius: 10px;
    overflow: hidden;
  }

  .livetag__overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    cursor: move;
  }
</style>
