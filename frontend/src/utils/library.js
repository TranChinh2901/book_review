export function buildLoadError(error) {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "(empty)";
  const details = error?.message ? ` Details: ${error.message}.` : "";

  return `Could not load data from the backend. Check VITE_API_BASE_URL and APP_CORS_ALLOWED_ORIGINS. API base: ${apiBase}.${details}`;
}

export function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

export function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function singular(type) {
  if (type === "authors") return "Author";
  if (type === "books") return "Book";
  return "Review";
}

export function getListDescription(title) {
  if (title === "Authors") {
    return "Keep author records, book counts, and quick actions easy to scan.";
  }

  if (title === "Books") {
    return "Review book entries and author assignments without visual clutter.";
  }

  return "Read, update, and organize reader feedback with a clearer review workspace.";
}
