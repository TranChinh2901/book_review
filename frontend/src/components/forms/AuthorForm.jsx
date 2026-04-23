import { useState } from "react";
import { submitForm } from "../../utils/forms.js";
import { FormError, FormShell, ValidationNote } from "./FormShell.jsx";

export function AuthorForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit() {
    if (!name.trim()) {
      setErrors({ name: "Please enter name" });
      return;
    }

    await submitForm(() => onSubmit({ name: name.trim() }), setErrors);
  }

  return (
    <FormShell title="Authors › Create" lead="Create">
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter author name" />
      </label>
      <FormError message={errors.name} />
      <FormError message={errors.form} />
      <button className="solid-button align-right" onClick={handleSubmit}>
        Create
      </button>
      <ValidationNote text="Validation message shows after clicking Create with an empty name." />
    </FormShell>
  );
}
