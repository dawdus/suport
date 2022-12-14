import React from "react";
import { Item } from "./dist/Item";
import { Viewport } from "./dist/Viewport";

export const Wrapper = () => {
  return (
    <Viewport
      anchor={[0, 0]}
      canvas={{
        position: { x: 0, y: 0 },
        size: {
          width: 1000,
          height: 1000,
        },
        anchor: [0, 0],
        zoom: 30,
      }}
    >
      <Item position={{ x: 0, y: 100 }}>
        <div>smiki</div>
      </Item>
    </Viewport>
  );
};
