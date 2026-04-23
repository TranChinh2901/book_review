import { useEffect, useState } from "react";
import { api } from "../api.js";
import { buildLoadError } from "../utils/library.js";

export function useLibraryData() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function reload() {
    setLoadError("");
    setLoading(true);

    try {
      const [authorData, bookData, reviewData] = await Promise.all([
        api.listAuthors(),
        api.listBooks(),
        api.listReviews()
      ]);

      setAuthors(authorData);
      setBooks(bookData);
      setReviews(reviewData);
    } catch (error) {
      setLoadError(buildLoadError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    authors,
    books,
    reviews,
    loading,
    loadError,
    reload
  };
}
