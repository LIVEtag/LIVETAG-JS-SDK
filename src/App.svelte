<script>
  import { afterUpdate, beforeUpdate, createEventDispatcher } from 'svelte';
  import CloseBtn from './CloseBtn.svelte';
  import { debounce } from './debounce';
  import { isMobileBrowser } from './device-type';
  import { drag, touched } from './directives';
  import DocumentClass from './DocumentClass.svelte';
  import { EVENT_ADD_TO_CART, EVENT_CHECKOUT, EVENT_READY, EVENT_VIEW_PRODUCT } from './events';
  import { isTouchDevice } from './is-touch-device';
  import Loader from './Loader.svelte';
  import MaximizeBtn from './MaximizeBtn.svelte';
  import MetaViewport from './MetaViewport.svelte';
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
  import { generateUid, getUid, storeUid } from './uid';
  import Widget from './Widget.svelte';
  import { widget } from './widgetStore';

  let shopUrl = window.location.href;

  let uid = getUid() || generateUid();
  storeUid(uid);

  let dispatch = createEventDispatcher();

  let port;
  let loadingError = false;

  //
  // Shop props
  //
  export let shopUri;
  export let widgetUrl;
  export let sessionId = null;

  let isMobile = isMobileBrowser();
  let hasTouch = isTouchDevice();

  //
  // Widget state props
  //
  export let open = false;
  export let minimized = false;

  let ready = false;
  let translate = null;

  let translateStyle;
  $: translateStyle =
    minimized && translate && (translate.x || translate.y)
      ? `translate3d(${translate.x || 0}px, ${translate.y || 0}px, 0)`
      : 'initial';

  let showButtons;
  $: showButtons = minimized || loadingError || !ready;

  const onResize = debounce(
    () => {
      isMobile = isMobileBrowser();
      hasTouch = isTouchDevice();

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
  });

  let widgetParams;
  $: widgetParams = {
    widgetUrl,
    shopUri,
    shopUrl,
    uid,
    sessionId,
  };

  afterUpdate(() => {
    signal(SIGNAL_MINIMIZE, minimized);

    widget.set({ open, minimized, sessionId, translate });
  });

  //
  // Get initial state data and unsubscribe from store
  //
  widget.getState((state) => {
    open = state.open;
    minimized = state.minimized || state.open;
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
    if (minimized) {
      return;
    }

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

<div>
  {#if open && !minimized && isMobile}
    <MetaViewport content="width=device-width,initial-scale=1.0,maximum-scale=1.0" />
  {/if}

  {#if open && !minimized}
    <DocumentClass className="livetag--fullscreen" />
  {/if}

  {#if open}
    <div
      class="livetag__box"
      class:livetag__box--minimized={minimized}
      class:livetag__box--mobile={isMobile}
      class:livetag__box--touch={hasTouch}
      class:livetag__box--ready={ready}
      style="transform:{translateStyle}"
      use:drag={minimized}
      use:touched={3000}
      on:drag-end={onDragEnd}
    >
      {#if !ready && !loadingError}
        <Loader />
      {/if}

      {#if showButtons}
        <div class="livetag__btns">
          {#if minimized}
            <MaximizeBtn class="livetag__btn" on:click={restore} />
          {:else}
            <span />
          {/if}

          <CloseBtn class="livetag__btn" on:click={close} />
        </div>
      {/if}

      {#if loadingError}
        <div class="livetag__error" on:click={close}>
          Live session cannot be loaded.
          <br />
          Please, try again.
        </div>
      {:else}
        <Widget params={widgetParams} {ready} {onLoad} {onSignal} {onError} />
      {/if}

      {#if minimized}
        <div class="livetag__overlay" />
      {/if}
    </div>
  {/if}
</div>

<style>
  :root {
    --livetag-loader-size: min(48px, calc(var(--livetag-widget-height--minimized) / 6));
    --livetag-widget-width--minimized: calc(var(--livetag-widget-height--minimized) / 1.777);
    --livetag-widget-height--minimized: max(160px, min(30vh, 720px));
  }

  :global(.livetag--fullscreen) {
    overflow: hidden !important;
    overscroll-behavior: none !important;
  }

  .livetag__btns {
    position: absolute;
    top: 0;
    width: 100%;
    padding: calc(var(--livetag-widget-height--minimized) / 32);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    z-index: 11;
    /*CRUTCH for mobile Safari. When moving a minimized widget sometimes
       the buttons are hidden for some unknown reason, adding animation solves the problem*/
    animation: livetag__btns 1s linear infinite;
  }

  @keyframes livetag__btns {
    to {
      transform: translate(0, 0);
    }
  }

  :global(.livetag__btn) {
    --size: calc(var(--livetag-widget-height--minimized) / 10);
    border: none;
    background-color: rgba(0, 0, 0, 0.35);
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    color: #fff;
    font-size: 0;
    line-height: 0;
    padding: 0;
    cursor: pointer;
    min-width: 24px;
    min-height: 24px;
  }

  :global(.livetag__box--touch .livetag__btn) {
    min-width: 32px;
    min-height: 32px;
  }

  :global(.livetag__btn svg) {
    width: 50%;
    height: 50%;
  }

  .livetag__error {
    display: flex;
    place-content: center;
    place-items: center;
    height: 100%;
    color: #fff;
    text-align: center;
    font-size: 2em;
    line-height: 1.1;
    box-sizing: border-box;
    padding: 0.5em;
  }

  .livetag__box--minimized .livetag__error {
    font-size: max(0.8em, calc(var(--livetag-widget-height--minimized) / 15));
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
    transition: background-color 0.2s ease;
  }

  .livetag__box--minimized {
    position: fixed;
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

  .livetag__box--minimized.livetag__box--ready {
    background-color: transparent;
  }

  .livetag__overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    cursor: move;
    z-index: 3;
  }

  .livetag__box--minimized.livetag__box--touch .livetag__btns {
    opacity: 0;
    transition: opacity 0.2s ease-in;
    pointer-events: none;
  }

  :global(.livetag__box--minimized.livetag__box--touch.touched) .livetag__btns {
    opacity: 1;
    transition: opacity 0.2s ease-in;
    pointer-events: initial;
  }
</style>
