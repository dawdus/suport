import * as React from "react";
import { VirtualCanvas, Canvas, Parent } from "./virtualCanvas";
import { useWheelEvent, Anchor } from "./useWheelEvent";
import { useViewportSize } from "./useVieportSize";

interface Props extends Parent {
  canvas?: Canvas;
  anchor?: Anchor;
  touch?: ({ x, y }: { x: number; y: number }) => void;
  rulers?: JSX.Element | JSX.Element[];
}

export const Viewport = ({
  children,
  anchor,
  canvas: c = {
    position: { x: 0, y: 0 },
    size: { width: 1000, height: 1000 },
    anchor: [0, 0],
    zoom: 40,
  },
  rulers,
  touch,
}: Props) => {
  let [target, gesture] = useWheelEvent();
  let resize = useViewportSize();
  const [canvas, setCanvas] = React.useState<VirtualCanvas>(
    VirtualCanvas.make(c.position, c.size, c.anchor, c.zoom)
  );

  React.useLayoutEffect(() => {
    if (gesture) {
      const g = gesture;
      setCanvas((s) => (s ? s.translate(g) : s));
    }
  }, [gesture]);

  React.useLayoutEffect(() => {
    if (target.current) {
      let t = target.current;
      let { x, y, width, height } = t.getBoundingClientRect();
      setCanvas((s) =>
        s.attach({
          position: { x, y },
          size: { width, height },
          anchor: anchor ?? [0, 0],
          constructor: { position: { x, y }, size: { width, height } },
        })
      );
    }
  }, [anchor, target, resize]);

  const list = canvas
    ? children
      ? Array.isArray(children)
        ? children.map((a, i) =>
            React.cloneElement(a, {
              canvas,
              key: `canvas-child-${i}`,
            })
          )
        : [
            React.cloneElement(children, {
              canvas,
              key: `canvas-child`,
            }),
          ]
      : []
    : [];

  return (
    <div
      onClick={(e) => {
        if (touch) {
          touch(canvas.touchCoord({ x: e.clientX, y: e.clientY }));
        }
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: `100%`,
          display: "flex",
          flexGrow: 1,
          flexShrink: 1,
        }}
      >
        {rulers}
        <div
          style={{
            flexShrink: 1,
            position: "relative",
            width: "100%",
            height: "100%",
          }}
          ref={target}
        >
          {list}
        </div>
      </div>
    </div>
  );
};
