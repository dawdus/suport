import React from 'react';
import './App.css';
import { Viewport, Item } from './components';
const anchor: [number, number] = [1, 1];
function App() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'gray',
        }}
      >
        <Viewport
          anchor={anchor}
          canvas={{
            size: { width: 1000, height: 1000 },
            position: { x: 0, y: 0 },
            anchor: anchor,
            zoom: 100,
          }}
        >
          <Item position={{ x: 0, y: 0 }} size={{ width: 280, height: 200 }} anchor={anchor}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'coral',
              }}
            >
              oink
            </div>
          </Item>
        </Viewport>
      </div>
    </div>
  );
}

export default App;
