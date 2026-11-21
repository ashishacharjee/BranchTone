/**
 * Vitest setup — imports jest-dom matchers and polyfills.
 */
import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

// Silence JSDOM "Not implemented: HTMLCanvasElement.prototype.getContext" stderr in OscilloscopeCanvas tests
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (function (
    this: HTMLCanvasElement,
    ..._args: unknown[]
  ) {
    return {
      canvas: this,
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (_x: number, _y: number, w: number, h: number) => ({
        data: new Array(w * h * 4).fill(0),
        colorSpace: 'srgb',
        height: h,
        width: w,
      }),
      putImageData: () => {},
      createImageData: () => [] as unknown as ImageData,
      setTransform: () => {},
      resetTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      strokeText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      strokeRect: () => {},
      fill: () => {},
      arc: () => {},
      measureText: () => ({ width: 0 } as TextMetrics),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    };
  } as unknown as typeof HTMLCanvasElement.prototype.getContext);
}
