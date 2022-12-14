import * as React from "react";
import {
  Anchor,
  Point,
  Size,
  Gesture,
  Delta,
  Coords,
  Geometry,
} from "./useWheelEvent";

export type Parent = {
  children?: JSX.Element | JSX.Element[];
};

export interface Canvas extends Geometry {
  zoom: number;
}
export interface Positionable extends Geometry {
  constructor: Coords;
}
const point = (): Positionable => ({
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
  anchor: [0, 0],
  constructor: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 } },
});

export class VirtualCanvas {
  protected _position: Point;
  protected _size: Size;
  protected _anchor: Anchor;
  protected _zoom: number;
  protected _original: Coords;
  protected _delta: Delta;
  protected _viewport: Positionable;
  protected _minzoom: number;
  protected _config = { x: true, y: true };

  private constructor(
    position: Point,
    size: Size,
    anchor: Anchor,
    zoom: number,
    original: Coords,
    delta: Delta,
    viewport: Positionable,
    minzoom: number
  ) {
    this._anchor = anchor;
    this._size = size;
    this._zoom = zoom;
    this._position = position;
    this._delta = delta;
    this._original = original;
    this._viewport = viewport;
    this._minzoom = minzoom;
  }
  static make(position: Point, size: Size, anchor: Anchor, zoom: number) {
    return new VirtualCanvas(
      position,
      size,
      anchor,
      zoom,
      {
        position: { ...position },
        size: { ...size },
      },
      { ...position, zoom: zoom - 100 },
      point(),
      100
    );
  }
  public attach = (v: Positionable) => {
    this._viewport = v;
    // if (this._config.x === false) {
    //   this._original.size.width = v.size.width;
    // }
    if (v.size.width > this._original.size.width) {
      this._original.size.width = v.size.width;
    }
    if (v.size.height > this._original.size.height) {
      this._original.size.height = v.size.height;
    }
    this._minzoom =
      (this._config.x && this._config.y
        ? 1 /
          Math.min(
            this.original.size.width / v.constructor.size.width,
            this.original.size.height / v.constructor.size.height
          )
        : this._config.x
        ? 1 / (this.original.size.width / v.constructor.size.width)
        : 1 / (this.original.size.height / v.constructor.size.height)) * 100;
    if (this._zoom < this._minzoom) {
      this._zoom = this._minzoom;
    }
    return this.reposition();
  };

  private reposition() {
    this._zoom = 100 + this._delta.zoom;
    this._size.width = this.original.size.width * this.scaleAxis.x;
    this._size.height = this.original.size.height * this.scaleAxis.y;
    this._position.x = this._delta.x + this.offsetX;
    this._position.y = this._delta.y + this.offsetY;
    return this.clone();
  }
  private clone() {
    return new VirtualCanvas(
      this._position,
      this._size,
      this._anchor,
      this._zoom,
      this._original,
      this._delta,
      this._viewport,
      this._minzoom
    );
  }
  get config() {
    return this._config;
  }
  get minzoom() {
    return this._minzoom;
  }
  get x() {
    return this._position.x;
  }
  get offsetX() {
    return (
      this.viewport.anchor[0] * this.viewport.size.width -
      this.anchor[0] * this.size.width +
      this.original.position.x * this.scaleAxis.x
    );
  }
  get offsetY() {
    return (
      this.viewport.anchor[1] * this.viewport.size.height -
      this.anchor[1] * this.size.height +
      this.original.position.y * this.scaleAxis.y
    );
  }
  get y() {
    return this._position.y;
  }
  get width() {
    return this._size.width;
  }
  get height() {
    return this._size.height;
  }
  get scale() {
    return this._zoom / 100;
  }
  get scaleAxis() {
    return {
      x: this._config.x ? this._zoom / 100 : 1,
      y: this._config.y ? this._zoom / 100 : 1,
    };
  }
  get zoom() {
    return this._zoom;
  }
  get original() {
    return this._original;
  }
  get position() {
    return this._position;
  }
  get size() {
    return this._size;
  }
  get viewport() {
    return this._viewport;
  }
  get anchor() {
    return this._anchor;
  }
  get roomX() {
    return (
      this.scaleAxis.x * this.original.size.width - this.viewport.size.width
    );
  }
  get roomY() {
    return (
      this.scaleAxis.y * this.original.size.height - this.viewport.size.height
    );
  }
  get rect() {
    return { position: this.position, size: this.size };
  }
  get viewportRect() {
    return { position: this.viewport.position, size: this.viewport.size };
  }
  public touchCoord = (client: Point) => {
    return {
      x:
        (client.x - this.viewport.position.x - this.position.x) /
        this.size.width,
      y:
        (client.y - this.viewport.position.y - this.position.y) /
        this.size.height,
    };
  };
  public translate = (
    { type, delta, client }: Gesture,
    clientTouch?: boolean
  ) => {
    let touch: Point;
    if (clientTouch) {
      touch = client;
    } else {
      touch = this.touchCoord(client);
    }

    let nextX = this._delta.x;
    let nextY = this._delta.y;
    let nextZ = this._delta.zoom;
    let zoomMultiplier = clientTouch ? 1 : this.zoom / 100;
    let workableDeltaZ = delta.zoom * zoomMultiplier;
    if (type === "zoom") {
      nextZ = nextZ - workableDeltaZ;
    } else {
      nextX = nextX - delta.x;
      nextY = nextY - delta.y;
    }

    if (nextZ + 100 > this.minzoom) {
      if (this._config.x) {
        nextX =
          nextX +
          ((this.original.size.width * workableDeltaZ) / 100) *
            (touch.x - this.anchor[0]);
      }
      if (this._config.y) {
        nextY =
          nextY +
          ((this.original.size.height * workableDeltaZ) / 100) *
            (touch.y - this.anchor[1]);
      }
      this._delta = {
        ...this._delta,
        zoom: nextZ,
      };
    } else {
      this._delta = {
        ...this._delta,
        zoom: -100 + this.minzoom,
      };
    }

    this._zoom = 100 + this._delta.zoom;

    this._zoom = Math.max(this._zoom, 25);
    this._size.width = this.original.size.width * this.scaleAxis.x;
    this._size.height = this.original.size.height * this.scaleAxis.y;

    if (nextX > -this.roomX - this.offsetX && nextX < -this.offsetX) {
      this._delta = {
        ...this._delta,
        x: nextX,
      };
    } else {
      this._delta = {
        ...this._delta,
        x: nextX >= -this.offsetX ? -this.offsetX : -this.roomX - this.offsetX,
      };
    }
    if (nextY > -this.roomY - this.offsetY && nextY < -this.offsetY) {
      this._delta = {
        ...this._delta,
        y: nextY,
      };
    } else {
      this._delta = {
        ...this._delta,
        y: nextY >= -this.offsetY ? -this.offsetY : -this.roomY - this.offsetY,
      };
    }
    this._position.x = this._delta.x + this.offsetX;
    this._position.y = this._delta.y + this.offsetY;
    return this.clone();
  };
}
