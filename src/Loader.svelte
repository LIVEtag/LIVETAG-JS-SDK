<div class="livetag__loader">
  <svg
    viewBox="0 0 1024 1024"
    focusable="false"
    fill="currentColor"
    width="1em"
    height="1em"
    data-icon="loading"
    aria-hidden="true"
  >
    <path
      d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
    />
  </svg>
</div>

<style>
  .livetag__loader {
    --position: calc(50% - var(--livetag-loader-size) / 2);
    position: absolute;
    top: var(--position);
    left: var(--position);
    z-index: 11;
  }

  .livetag__loader svg {
    fill: white;
    width: var(--livetag-loader-size);
    height: var(--livetag-loader-size);
    display: inline-block;
    animation: loading 1s linear infinite;
  }

  @keyframes loading {
    to {
      transform: rotate(1turn);
    }
  }
</style>
