import { debounce } from '../debounce';

/**
 * @param {HTMLElement} node
 * @param {boolean} enable
 * @return {{update(*=): void, destroy(): void}}
 */
export function drag(node, enable) {
  let _draggable;
  if (enable) {
    init();
  }

  function init() {
    setTimeout(() => {
      _draggable = draggable(node);
    });
  }

  function destroy() {
    if (_draggable) {
      _draggable.destroy();
      _draggable = undefined;
    }
  }

  return {
    update(drag) {
      if (!drag && _draggable) {
        destroy();
      }

      if (drag) {
        init();
      }
    },
    destroy() {
      destroy();
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

  ({ x: initialX, y: initialY } = translate(node, x, y));

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
      ({ x: initialX, y: initialY } = translate(node, initialX, initialY));

      xOffset = initialX;
      yOffset = initialY;

      onDragEndDebounced({ x: initialX, y: initialY });
    },
    200,
    false
  );

  onDragEndDebounced({ x: initialX, y: initialY });

  node.addEventListener('mousedown', dragStart);
  node.addEventListener('touchstart', dragStart);

  window.addEventListener('resize', onResizeDebounced, { passive: true });

  function dragEnd() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);

    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', dragEnd);

    if (currentX !== undefined && currentY !== undefined) {
      onDragEndDebounced({ x: currentX, y: currentY });

      initialX = currentX;
      initialY = currentY;

      xOffset = currentX;
      yOffset = currentY;
    }
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

    ({ x: currentX, y: currentY } = translate(node, currentX, currentY));
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

function translate(node, x, y) {
  let pos = constraints(node, x, y);
  setTranslate(node, pos.x, pos.y);

  return pos;
}

/**
 * @param {HTMLElement} node
 * @param {number} x
 * @param {number} y
 * @return {{x: number, y: number}}
 */
function constraints(node, x, y) {
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
 * @param {HTMLElement} el
 * @param {number} x
 * @param {number} y
 * @return {void}
 */
function setTranslate(el, x, y) {
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
