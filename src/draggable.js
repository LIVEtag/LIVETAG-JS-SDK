import { debounce } from './debounce';

/**
 * @param {HTMLElement} node
 * @param {boolean} enable
 * @return {{update(*=): void, destroy(): void}}
 */
export function drag(node, enable) {
  let _draggable;
  if (enable) {
    _draggable = draggable(node);
  }

  return {
    update(drag) {
      if (!drag && _draggable) {
        _draggable.destroy();
        _draggable = undefined;
      }

      if (drag) {
        _draggable = draggable(node);
      }
    },
    destroy() {
      if (_draggable) {
        _draggable.destroy();
        _draggable = undefined;
      }
    },
  };
}

/**
 * @param {HTMLElement} node
 * @return {{destroy(): void}}
 */
export function draggable(node) {
  const [x, y] = getTranslate(node);

  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset;
  let yOffset;

  ({ x: initialX, y: initialY } = constraints(x, y, node));

  setTranslate(initialX, initialY, node);

  xOffset = initialX;
  yOffset = initialY;

  let onDragEndDebounced = debounce(
    ({ x, y }) => {
      node.dispatchEvent(
        new CustomEvent('drag-end', {
          detail: { x, y },
        })
      );
    },
    200,
    false
  );

  let onResizeDebounced = debounce(
    () => {
      ({ x: initialX, y: initialY } = constraints(initialX, initialY, node));

      setTranslate(initialX, initialY, node);

      onDragEndDebounced({ x: initialX, y: initialY });
    },
    200,
    false
  );

  onResizeDebounced();

  node.addEventListener('mousedown', dragStart);
  node.addEventListener('touchstart', dragStart);

  window.addEventListener('resize', onResizeDebounced, { passive: true });

  function dragEnd(e) {
    onDragEndDebounced({ x: currentX, y: currentY });

    initialX = currentX;
    initialY = currentY;

    xOffset = currentX;
    yOffset = currentY;

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);

    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', dragEnd);
  }

  function dragStart(e) {
    // Start dragging only if left mouse button is pressed
    if (e.type === 'mousedown' && e.button !== 0) {
      return;
    }

    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
  }

  function drag(e) {
    if (e.type === 'touchmove') {
      currentX = Math.floor(e.touches[0].clientX - initialX);
      currentY = Math.floor(e.touches[0].clientY - initialY);
    } else {
      e.preventDefault();

      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    ({ x: currentX, y: currentY } = constraints(currentX, currentY, node));

    setTranslate(currentX, currentY, node);
  }

  return {
    destroy() {
      node.removeEventListener('mousedown', dragStart);
      node.removeEventListener('touchstart', dragStart);

      window.removeEventListener('resize', onResizeDebounced);

      node.style.transform = null;
    },
  };
}

/**
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} node
 * @return {{x: number, y: number}}
 */
function constraints(x, y, node) {
  let xPos = window.innerWidth + x - node.clientWidth;
  if (xPos < 20) {
    x = -(window.innerWidth - node.clientWidth - 20);
  } else if (xPos > window.innerWidth - node.clientWidth - 10) {
    x = 0;
  }

  let yPos = window.innerHeight + y - node.clientHeight;
  if (yPos < 20) {
    y = -(window.innerHeight - node.clientHeight - 20);
  } else if (yPos > window.innerHeight - node.clientHeight - 10) {
    y = 0;
  }

  return { x, y };
}

/**
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} el
 * @return {void}
 */
function setTranslate(x, y, el) {
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

/**
 * @param {HTMLElement} el
 * @return {[number, number]}
 */
function getTranslate(el) {
  const r = /matrix\(1, 0, 0, 1, (-?[0-9]+), (-?[0-9]+)\)/;

  const matches = r.exec(window.getComputedStyle(el).transform) || [];

  return [matches[1] ? +matches[1] : 0, matches[2] ? +matches[2] : 0];
}
