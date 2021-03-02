/**
 * @param {HTMLElement} node
 * @param {number} waitSeconds Delay after which the class will be deleted
 * @return {function(): void}
 */
export function touched(node, waitSeconds = 3000) {
  const className = 'touched';
  let timer;

  node.addEventListener('touchstart', onTouchstart, { passive: true });

  function onTouchstart() {
    node.classList.add(className);

    startTimer();

    node.addEventListener('touchmove', onTouchmove, { passive: true });
    node.addEventListener('touchend', onTouchend, { passive: true });
    node.addEventListener('touchcancel', onTouchend, { passive: true });
  }

  function onTouchmove() {
    stopTimer();
  }

  function onTouchend() {
    startTimer();
  }

  function startTimer() {
    stopTimer();

    timer = setTimeout(() => {
      node.classList.remove(className);
    }, waitSeconds);
  }

  function stopTimer() {
    if (timer) {
      clearTimeout(timer);
    }
  }

  return () => {
    stopTimer();

    node.classList.remove(className);

    node.removeEventListener('touchstart', onTouchstart);
    node.removeEventListener('touchmove', onTouchmove);
    node.removeEventListener('touchend', onTouchend);
    node.removeEventListener('touchcancel', onTouchend);
  };
}
