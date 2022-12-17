import * as React from 'react';
import { VirtualCanvas, Parent } from './virtualCanvas';
import type { Anchor, Point, Coords, Size, Geometry } from './useWheelEvent';

interface PositionableProps extends Parent {
  position?: Point;
  size?: Size;
  anchor?: Anchor;
  canvas?: VirtualCanvas;
  render?: (coords: Coords, canvas: VirtualCanvas) => [React.CSSProperties, JSX.Element[]];
}

const computedCoords = (canvas: VirtualCanvas, { position, size, anchor }: Geometry): Coords => {
  const xscale = canvas.config.x ? canvas.scale : 1;
  const yscale = canvas.config.y ? canvas.scale : 1;
  return {
    size: {
      width: size.width * xscale,
      height: size.height * yscale,
    },
    position: {
      x: canvas.x + canvas.anchor[0] * canvas.width - anchor[0] * size.width + position.x * xscale,
      y: canvas.y + canvas.anchor[1] * canvas.height - anchor[1] * size.height + position.y * yscale,
    },
  };
};

export const Item = ({ position, size, anchor, canvas, children, render }: PositionableProps) => {
  const computed = canvas
    ? computedCoords(canvas, {
        size: size ?? { width: 100, height: 100 },
        position: position ?? { x: 0, y: 0 },
        anchor: anchor ?? [0, 0],
      })
    : {
        size: size ?? { width: 100, height: 100 },
        position: position ?? { x: 0, y: 0 },
      };

  let props: React.CSSProperties = {
    position: 'absolute',
    width: computed.size.width,
    height: computed.size.height,
    top: computed.position.y,
    left: computed.position.x,
    overflow: 'hidden',
  };
  let renderedChildren: JSX.Element[] = Array.isArray(children) ? [...children] : children ? [children] : [];
  if (render && canvas) {
    const r = render(computed, canvas);
    renderedChildren = [...renderedChildren, ...r[1]];
    props = { ...props, ...r[0] };
  }

  return (
    <div
      style={{
        ...props,
      }}
    >
      {renderedChildren}
    </div>
  );
};
