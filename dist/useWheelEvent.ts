import React from "react";
export type Point = {
  x: number;
  y: number;
};
export type Size = {
  width: number;
  height: number;
};
export type Anchor = [number, number];

export interface Coords {
  position: Point;
  size: Size;
}
export interface Geometry extends Coords {
  anchor: Anchor;
}
type GestureDelta<X, Y, Z> = {
  x: X;
  y: Y;
  zoom: Z;
};
type GestureType<T, D> = {
  type: T;
  delta: D;
  client: Point;
};
export type Delta = GestureDelta<number, number, number>;
type Pan = GestureType<"pan", GestureDelta<number, number, 0>>;
type Zoom = GestureType<"zoom", GestureDelta<0, 0, number>>;
export type Gesture = Pan | Zoom;
const recognizeGesture = ({
  deltaX,
  deltaY,
  ctrlKey,
  clientX,
  clientY,
}: WheelEvent): Gesture =>
  ctrlKey
    ? {
        type: "zoom",
        delta: { x: 0, y: 0, zoom: deltaY },
        client: { x: clientX, y: clientY },
      }
    : {
        type: "pan",
        delta: { x: deltaX, y: deltaY, zoom: 0 },
        client: { x: clientX, y: clientY },
      };

export const useWheelEvent = (): [
  React.MutableRefObject<HTMLDivElement | null>,
  Gesture | undefined
] => {
  let [gesture, setGesture] = React.useState<Gesture>();
  const target = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    let t = target.current;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setGesture(recognizeGesture(e));
    };
    if (t) {
      t.addEventListener("wheel", handleWheel);
    }
    return () => {
      t?.removeEventListener("wheel", handleWheel);
    };
  }, []);
  return [target, gesture];
};
