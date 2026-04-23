import { useState } from "react";
import { submitForm } from "../../utils/forms.js";
import { FormError, FormShell, ValidationNote } from "./FormShell.jsx";

export function ReviewForm({ books, onSubmit }) {
  const [bookId, setBookId] = useState("");
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit() {
    const nextErrors = {};

    if (!bookId) {
      nextErrors.bookId = "Please select book";
    }

    if (!review.trim()) {
      nextErrors.review = "Please enter review";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await submitForm(() => onSubmit({ bookId: Number(bookId), review: review.trim() }), setErrors);
  }

  return (
    <FormShell title="Reviews › Create" lead="Create">
      <label>
        Book
        <select value={bookId} onChange={(event) => setBookId(event.target.value)}>
          <option value="">Select book</option>
          {books.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <FormError message={errors.bookId} />

      <label>
        Review
        <textarea value={review} onChange={(event) => setReview(event.target.value)} placeholder="Enter your review" />
      </label>
      <FormError message={errors.review} />
      <FormError message={errors.form} />

      <button className="solid-button align-right" onClick={handleSubmit}>
        Create
      </button>
      <ValidationNote text="Validation message shows after clicking Create with empty fields." />
    </FormShell>
  );
}
