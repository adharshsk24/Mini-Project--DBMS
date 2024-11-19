import React, { useState } from "react";

export default function EditableField({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <strong>{label}: </strong>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <span onClick={() => setEditing(true)}>{value}</span>
      )}
    </div>
  );
}
