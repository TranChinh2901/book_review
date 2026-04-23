import { useState } from "react";
import { api } from "../../api.js";
import { singular } from "../../utils/library.js";
import { Icon } from "../Icon.jsx";

export function RecordModal({ modal, authors, books, onClose, onMutate }) {
  const { mode, type, record } = modal;
  const [draft, setDraft] = useState(record);
  const title = `${mode === "edit" ? "Update" : "Delete"} ${singular(type)}`;

  async function handleApply() {
    await onMutate(buildUpdateAction(type, record.id, draft));
    onClose();
  }

  async function handleRemove() {
    await onMutate(buildDeleteAction(type, record.id));
    onClose();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <header>
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        {mode === "delete" ? (
          <DeletePanel type={type} onClose={onClose} onDelete={handleRemove} />
        ) : (
          <EditPanel
            type={type}
            draft={draft}
            authors={authors}
            books={books}
            onChange={setDraft}
            onClose={onClose}
            onSubmit={handleApply}
          />
        )}
      </div>
    </div>
  );
}

function buildUpdateAction(type, id, draft) {
  if (type === "authors") {
    return () => api.updateAuthor(id, { name: draft.name });
  }

  if (type === "books") {
    return () => api.updateBook(id, { title: draft.title, authorId: Number(draft.authorId) });
  }

  return () => api.updateReview(id, { bookId: Number(draft.bookId), review: draft.review });
}

function buildDeleteAction(type, id) {
  if (type === "authors") {
    return () => api.deleteAuthor(id);
  }

  if (type === "books") {
    return () => api.deleteBook(id);
  }

  return () => api.deleteReview(id);
}

function DeletePanel({ type, onClose, onDelete }) {
  return (
    <div className="delete-panel">
      <div className="delete-icon">
        <Icon name="trash" />
      </div>
      <p>Are you sure you want to delete this {singular(type).toLowerCase()}?</p>
      <footer>
        <button onClick={onClose}>Cancel</button>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </footer>
    </div>
  );
}

function EditPanel({ type, draft, authors, books, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-form">
      {type === "authors" && (
        <label>
          Name
          <input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
        </label>
      )}

      {type === "books" && (
        <>
          <label>
            Title
            <input value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} />
          </label>
          <label>
            Author
            <select value={draft.authorId} onChange={(event) => onChange({ ...draft, authorId: event.target.value })}>
              {authors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {type === "reviews" && (
        <>
          <label>
            Book
            <select value={draft.bookId} onChange={(event) => onChange({ ...draft, bookId: event.target.value })}>
              {books.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Review
            <textarea value={draft.review} onChange={(event) => onChange({ ...draft, review: event.target.value })} />
          </label>
        </>
      )}

      <footer>
        <button onClick={onClose}>Cancel</button>
        <button className="solid-button" onClick={onSubmit}>
          Update
        </button>
      </footer>
    </div>
  );
}
