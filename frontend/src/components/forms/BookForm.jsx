import { useState } from "react";
import { submitForm } from "../../utils/forms.js";
import { FormError, FormShell, ValidationNote } from "./FormShell.jsx";

export function BookForm({ authors, onSubmit }) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit() {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Please enter name";
    }

    if (!authorId) {
      nextErrors.authorId = "Please select author";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await submitForm(() => onSubmit({ title: title.trim(), authorId: Number(authorId) }), setErrors);
  }

  return (
    <FormShell title="Books › Create" lead="Create">
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter book title" />
      </label>
      <FormError message={errors.title} />

      <label>
        Author
        <select value={authorId} onChange={(event) => setAuthorId(event.target.value)}>
          <option value="">Select author</option>
          {authors.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <FormError message={errors.authorId} />
      <FormError message={errors.form} />

      <button className="solid-button align-right" onClick={handleSubmit}>
        Create
      </button>
      <ValidationNote text="Create checks both title and author before saving." />
    </FormShell>
  );
}
