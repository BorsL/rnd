import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const sidebarItems = ['Timbro', 'Firma', 'Testo', 'Logo'];

const SidebarItem = ({ type }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="mb-2.5 p-1.5 border border-gray-400 cursor-grab"
    >
      {type}
    </div>
  );
};

const Container = ({ children, onDrop }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    onDrop(data, e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-1 h-[500px] m-2.5 p-2.5 border-2 border-dashed border-gray-300 relative"
    >
      {children}
    </div>
  );
};

const DraggableItem = ({ item, onDragStop, onResize, onRemove }) => {
  return (
    <Rnd
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      onDragStop={(e, d) => onDragStop(item.id, d.x, d.y)}
      onResize={(e, direction, ref, delta, position) =>
        onResize(item.id, ref.offsetWidth, ref.offsetHeight, position.x, position.y)
      }
      bounds="parent"
    >
      <div
        className="w-full h-full bg-blue-200 flex items-center justify-center cursor-move"
        style={{ fontSize: `${Math.min(item.width, item.height) / 3}px` }}
        onDoubleClick={() => onRemove(item.id)}
      >
        {item.type}
      </div>
    </Rnd>
  );
};

const App = () => {
  const [items, setItems] = useState([]);

  const handleDrop = (data, e) => {
    const { type } = JSON.parse(data);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newItem = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      width: 100,
      height: 100,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDragStop = (itemId, x, y) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, x, y } : item));
  };

  const handleResizeStop = (itemId, width, height, x, y) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, width, height, x, y } : item));
  };

  const handleRemove = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="flex">
      <div className="w-[200px] p-2.5 border-r border-gray-300">
        {sidebarItems.map((type) => (
          <SidebarItem key={type} type={type} />
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <Container onDrop={handleDrop}>
          {items.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              onDragStop={handleDragStop}
              onResize={handleResizeStop}
              onRemove={handleRemove}
            />
          ))}
        </Container>
      </div>
    </div>
  );
};

export default App;