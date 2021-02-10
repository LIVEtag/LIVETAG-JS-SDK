<script context="module">
  export const EVENT_ADD_TO_CART = 'addToCart';
  export const EVENT_VIEW_PRODUCT = 'viewProduct';
  export const EVENT_CHECKOUT = 'checkout';
</script>

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
  import { generateUid, getUid, storeUid } from './uid';
  import Widget from './Widget.svelte';
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
  let ready = false;
  let translate = null;

  let src = createWidgetUrl(widgetUrl, projectId, { uid, sessionId, isDesktop, shopUrl: window.location.href });

  let isMinimized, translateStyle;
  $: isMinimized = !isMobile && minimized;
  $: translateStyle =
    minimized && isDesktop && translate && (translate.x || translate.y)
      ? `translate3d(${translate.x || 0}px, ${translate.y || 0}px, 0)`
      : 'initial';

  beforeUpdate(() => {
    if (!open && loadingError) {
      loadingError = false;
    }
  });

  afterUpdate(() => {
    if (isDesktop) {
      signal(SIGNAL_MINIMIZE, isMinimized);
    }

    widget.set({ open, minimized: isMinimized, sessionId, translate });
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
    minimized = isDesktop;
    translate = null;
  }

  function restore() {
    minimized = false;
    translate = null;
  }

  const signalHandlers = {
    [SIGNAL_READY]: (event, data) => {
      ready = true;

      signal(SIGNAL_MINIMIZE, isMinimized);
    },
    [SIGNAL_MINIMIZE]: (event, data) => {
      minimize();
    },
    [SIGNAL_CLOSE]: (event, data) => {
      close();
    },
    [SIGNAL_RESTORE]: (event, data) => {
      restore();

      signal(SIGNAL_MINIMIZE, isMinimized);
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
    if (translate === null || translate.x !== x || translate.y !== y) {
      translate = { x, y };
    }
  }

  const onResize = debounce(
    () => {
      isDesktop = isDesktopBrowser();
      isMobile = isMobileBrowser();

      signal(SIGNAL_IS_MOBILE, isMobile);
    },
    200,
    false
  );
</script>

<svelte:window on:resize={onResize} />

<div id="livetag">
  {#if open}
    <div
      class="livetag__box"
      class:livetag__box--minimized={isMinimized}
      class:livetag__box--mobile={isMobile}
      style="transform: {translateStyle}"
      use:drag={isMinimized}
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

      {#if isMinimized}
        <div class="livetag__overlay" />
      {/if}

      {#if isMinimized || isMobile}
        <div class="livetag__btns">
          {#if !isMobile}
            <button aria-label="Maximize" title="Maximize" class="livetag__btn livetag__btn-restore" on:click={restore}>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.96967 9.25762C1.26256 9.55052 1.73744 9.55052 2.03033 9.25762L9 2.28795L15.9697 9.25762C16.2626 9.55052 16.7374 9.55052 17.0303 9.25762C17.3232 8.96473 17.3232 8.48986 17.0303 8.19696L9.53033 0.696965C9.23744 0.404072 8.76256 0.404072 8.46967 0.696965L0.96967 8.19696C0.676777 8.48986 0.676777 8.96473 0.96967 9.25762Z"
                  fill="white"
                />
              </svg>
            </button>
          {/if}

          <button aria-label="Close" title="Close" class="livetag__btn livetag__btn-close" on:click={close}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.0303 0.96967C13.3232 1.26256 13.3232 1.73744 13.0303 2.03033L2.03033 13.0303C1.73744 13.3232 1.26256 13.3232 0.96967 13.0303C0.676777 12.7374 0.676777 12.2626 0.96967 11.9697L11.9697 0.96967C12.2626 0.676777 12.7374 0.676777 13.0303 0.96967Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.96967 0.96967C1.26256 0.676777 1.73744 0.676777 2.03033 0.96967L13.0303 11.9697C13.3232 12.2626 13.3232 12.7374 13.0303 13.0303C12.7374 13.3232 12.2626 13.3232 11.9697 13.0303L0.96967 2.03033C0.676777 1.73744 0.676777 1.26256 0.96967 0.96967Z"
                fill="white"
              />
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
    top: 0;
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
</style>
