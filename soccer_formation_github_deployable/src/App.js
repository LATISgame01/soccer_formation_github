import React, { useState, useRef } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import html2canvas from "html2canvas";

const initialPlayers = [
  { id: "1", name: "1", label: "GK", x: 210, y: 500 },
  { id: "2", name: "2", label: "DF1", x: 100, y: 400 },
  { id: "3", name: "3", label: "DF2", x: 180, y: 400 },
  { id: "4", name: "4", label: "DF3", x: 240, y: 400 },
  { id: "5", name: "5", label: "DF4", x: 320, y: 400 },
  { id: "6", name: "6", label: "MF1", x: 140, y: 300 },
  { id: "7", name: "7", label: "MF2", x: 280, y: 300 },
  { id: "8", name: "8", label: "FW1", x: 100, y: 200 },
  { id: "9", name: "9", label: "FW2", x: 180, y: 200 },
  { id: "10", name: "10", label: "FW3", x: 240, y: 200 },
  { id: "11", name: "11", label: "FW4", x: 320, y: 200 }
];

function Player({ player, onNameChange, onLabelChange }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: player.id });

  const top = transform ? player.y + transform.y : player.y;
  const left = transform ? player.x + transform.x : player.x;

  const handleNameInput = (e) => {
    const value = e.target.value;
    if (/\d/.test(value)) return;
    onLabelChange(player.id, value);
  };

  const handleNumberInput = (e) => {
    const value = e.target.value;
    if (!/^\d{0,2}$/.test(value)) return;
    onNameChange(player.id, value);
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ position: "absolute", top, left }}>
      <div style={{ width: 60, height: 60, position: "relative" }}>
        <img
          src="https://i.imgur.com/tuoxfz0.png"
          alt="uniform"
          width={60}
          height={60}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            userSelect: "none"
          }}
        />
        <input
          type="text"
          value={player.name}
          onChange={handleNumberInput}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center"
          }}
        />
      </div>
      <input
        type="text"
        value={player.label}
        onChange={handleNameInput}
        placeholder="이름 변경"
        style={{
          marginTop: 4,
          width: 60,
          textAlign: "center",
          fontSize: 12,
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "2px 4px"
        }}
      />
    </div>
  );
}

export default function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const fieldRef = useRef(null);

  const handleDragEnd = (event) => {
    const { delta, active } = event;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === active.id ? { ...p, x: p.x + delta.x, y: p.y + delta.y } : p
      )
    );
  };

  const handleNameChange = (id, newName) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const handleLabelChange = (id, newLabel) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, label: newLabel } : p))
    );
  };

  const handleDownload = async () => {
    if (!fieldRef.current) return;
    const canvas = await html2canvas(fieldRef.current);
    const link = document.createElement("a");
    link.download = "lineup.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={handleDownload}
        style={{
          marginBottom: 10,
          backgroundColor: "#2ecc71",
          border: "1.5px solid white",
          color: "white",
          padding: "6px 12px",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        PNG 저장
      </button>
      <div
        ref={fieldRef}
        style={{
          width: "480px",
          height: "600px",
          margin: "0 auto",
          backgroundImage: "url('https://i.imgur.com/gx69Hbw.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "2px solid #333",
          position: "relative",
          overflow: "hidden",
          borderRadius: "10px"
        }}
      >
        <DndContext onDragEnd={handleDragEnd}>
          {players.map((player) => (
            <Player
              key={player.id}
              player={player}
              onNameChange={handleNameChange}
              onLabelChange={handleLabelChange}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
