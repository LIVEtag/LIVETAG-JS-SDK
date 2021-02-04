<script>
  import { debounce } from './debounce';
  import { isDesktopBrowser, isMobileBrowser } from './device-type';
  import { widget } from './widgetStore';
  import Widget from './Widget.svelte';
  import Loader from './Loader.svelte';
  import { drag } from './draggable';
  import { beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte';
  import {
    createSignal,
    SIGNAL_CHECKOUT,
    SIGNAL_CLOSE,
    SIGNAL_MINIMIZE,
    SIGNAL_PRODUCT_ADD_TO_CART,
    SIGNAL_PRODUCT_VIEW,
    SIGNAL_READY,
    SIGNAL_RESTORE,
  } from './signal';
  import { createWidgetUrl } from './create-widget-url';
  import { generateUid, getUid, storeUid } from './uid';

  let uid = getUid() || generateUid();
  storeUid(uid);

  let dispatch = createEventDispatcher();

  let port;
  let loadingError = false;

  //
  // Shop props
  //
  export let shopId;
  export let widgetUrl;
  export let sessionId = null;

  let isDesktop = isDesktopBrowser();
  let isMobile = isMobileBrowser();

  //
  // Widget state props
  //
  export let open = false;
  export let minimized = false;
  let ready = false;
  let translate = null;

  let shopUrl = window.location.href;

  $: _minimized = !isMobile && minimized;
  $: widgetUrl = createWidgetUrl(widgetUrl, shopId, { uid, sessionId, isDesktop, shopUrl });
  $: translateStyle = minimized && isDesktop && translate && (translate.x || translate.y) ? `translate3d(${translate.x || 0}px, ${translate.y || 0}px, 0)` : 'initial';

  beforeUpdate(() => {
    if (!open && loadingError) {
      loadingError = false;
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
    minimized = isDesktop && state.minimized;
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
  }

  function restore() {
    minimized = false;
    translate = null;
  }

  const signalHandlers = {
    [SIGNAL_READY]: (event, data) => {
      ready = true;

      signal(SIGNAL_MINIMIZE, minimized);
    },
    [SIGNAL_MINIMIZE]: (event, data) => {
      minimize();
    },
    [SIGNAL_CLOSE]: (event, data) => {
      close();
    },
    [SIGNAL_RESTORE]: (event, data) => {
      restore();

      signal(SIGNAL_MINIMIZE, minimized);
    },
    [SIGNAL_PRODUCT_ADD_TO_CART]: (event, data) => {
      dispatch('addToCart', data);
    },
    [SIGNAL_PRODUCT_VIEW]: (event, data) => {
      dispatch('viewProduct', data);
    },
    [SIGNAL_CHECKOUT]: (event, data) => {
      dispatch('checkout', data);
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
    if (translate === null || (translate.x !== x || translate.y !== y)) {
      translate = { x, y };
    }
  }

  const onResize = debounce(() => {
    isMobile = isMobileBrowser();
  }, 500);
</script>

<svelte:window on:resize={onResize}/>

<div id="livetag">
  {#if open}
    <div class="livetag__box {_minimized ? 'livetag__box--minimized' : ''} {isMobile ? 'livetag__box--mobile' : ''}" style="transform: {translateStyle}" use:drag={_minimized} on:drag-end={onDragEnd}>
      {#if !ready && !loadingError}
        <Loader/>
      {/if}

      {#if loadingError}
        <div class="livetag__error" on:click={close}>Live session cannot be loaded.<br>Please, try again.</div>
      {:else}
        <div class="livetag__iframe-wrapper" on:click={minimize}>
          <Widget
            src={widgetUrl}
            {ready}
            {onLoad}
            {onSignal}
            {onError}
          />
        </div>
      {/if}

      {#if _minimized}
        <div class="livetag__overlay"></div>
      {/if}

      {#if _minimized || isMobile}
        <div class="livetag__btns">
          <button title="Maximize" class="livetag__btn livetag__btn-restore" on:click={restore}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path d="M22.5 12.273l-7.5 7.5M7.5 12.273l7.5 7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button title="Close" class="livetag__btn livetag__btn-close" on:click={close}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.03.97a.75.75 0 010 1.06l-11 11a.75.75 0 01-1.06-1.06l11-11a.75.75 0 011.06 0z" fill="#fff"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M.97.97a.75.75 0 011.06 0l11 11a.75.75 0 11-1.06 1.06l-11-11a.75.75 0 010-1.06z" fill="#fff"></path>
            </svg>
          </button>
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
    bottom: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

  .livetag__btn {
    border: none;
    background-color: rgba(0, 0, 0, 0.35);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #fff;
    font-size: 32px;
    line-height: 32px;
    padding: 0;
    cursor: pointer;
  }

  .livetag__btn-close svg {
    width: 16px;
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

  .livetag__box {
    background-color: rgba(0, 0, 0, 0.55);
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    z-index: 2147483647;
  }

  .livetag__box--mobile {

  }

  .livetag__box--mobile .livetag__iframe-wrapper {
    padding: 0;
  }

  .livetag__box--minimized {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 10px;
    margin-right: 10px;
    user-select: none;
    line-height: 0;
    width: var(--livetag-widget-width--minimized);
    height: var(--livetag-widget-height--minimized);
    box-shadow: 0 0 6px 2px #aaa;
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

  .livetag__iframe-wrapper {
    padding: 3em;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .livetag__box--minimized .livetag__iframe-wrapper {
    padding: 0;
  }
</style>
