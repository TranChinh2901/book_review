import { Icon } from "../Icon.jsx";

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button aria-label="Update" onClick={onEdit}>
        <Icon name="edit" />
      </button>
      <button aria-label="Delete" className="danger" onClick={onDelete}>
        <Icon name="trash" />
      </button>
    </div>
  );
}
