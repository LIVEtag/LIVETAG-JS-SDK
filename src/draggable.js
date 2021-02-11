import { debounce } from './debounce';

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

export function draggable(node) {
  const [x, y] = getTranslate(node);

  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = x;
  let yOffset = y;

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

  node.addEventListener('mousedown', dragStart);
  node.addEventListener('touchstart', dragStart);

  function dragEnd(e) {
    onDragEndDebounced({ x: currentX, y: currentY });

    initialX = currentX;
    initialY = currentY;

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
    e.preventDefault();

    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    let xPos = window.innerWidth + currentX - node.clientWidth;
    if (xPos < 20) {
      currentX = -(window.innerWidth - node.clientWidth - 20);
    } else if (xPos > (window.innerWidth - node.clientWidth - 10)) {
      currentX = 0;
    }

    let yPos = window.innerHeight + currentY - node.clientHeight;
    if (yPos < 20) {
      currentY = -(window.innerHeight - node.clientHeight - 20);
    } else if (yPos > (window.innerHeight - node.clientHeight - 10)) {
      currentY = 0;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, node);
  }

  return {
    destroy() {
      node.removeEventListener('mousedown', dragStart);
      node.removeEventListener('touchstart', dragStart);

      node.style.transform = null;
    },
  };
}

function setTranslate(x, y, el) {
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function getTranslate(el) {
  const r = /matrix\(1, 0, 0, 1, (-?[0-9]+), (-?[0-9]+)\)/;

  const matches = r.exec(window.getComputedStyle(el).transform) || [];

  return [matches[1] ? +matches[1] : 0, matches[2] ? +matches[2] : 0];
}
