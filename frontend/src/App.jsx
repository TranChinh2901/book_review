import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import logoUrl from "./assets/haibazo-logo.png";
import heroBooksUrl from "./assets/hero-books.png";

const navGroups = [
  { label: "Dashboard", items: [{ id: "dashboard", label: "Dashboard", icon: "grid" }] },
  {
    label: "Manage",
    items: [
      { id: "authors-list", label: "Authors", icon: "user" },
      { id: "books-list", label: "Books", icon: "book" },
      { id: "reviews-list", label: "Reviews", icon: "shield" }
    ]
  },
  { label: "Settings", items: [{ id: "profile", label: "Profile", icon: "circle" }] }
];

function Icon({ name }) {
  const icons = {
    menu: <><path d="M5 7h14" /><path d="M5 12h14" /><path d="M5 17h14" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>,
    user: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.3-4 12.7-4 14 0" /></>,
    book: <><path d="M5 5.5c3-1.2 5.2-.7 7 1v13c-1.8-1.7-4-2.2-7-1V5.5Z" /><path d="M19 5.5c-3-1.2-5.2-.7-7 1v13c1.8-1.7 4-2.2 7-1V5.5Z" /></>,
    shield: <path d="M12 3 19 6v5c0 4.2-2.8 7.4-7 10-4.2-2.6-7-5.8-7-10V6l7-3Z" />,
    circle: <circle cx="12" cy="12" r="7" />,
    edit: <path d="M5 18.5 6 14l8.8-8.8a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L10 18l-5 .5Z" />,
    trash: <><path d="M6 7h12" /><path d="M9 7V5h6v2" /><path d="M8 10v9h8v-9" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    bell: <><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z" /><path d="M10 21h4" /></>,
    close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;
}

export default function App() {
  const [view, setView] = useState("authors-list");
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadData() {
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
      setLoadError("Could not connect to the Spring Boot API. Start the backend on port 8080.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function mutate(action, nextView) {
    await action();
    await loadData();
    if (nextView) setView(nextView);
  }

  return (
    <div className="app-shell">
      <Hero />
      <section className="workspace" aria-label="Book review admin workspace">
        <Topbar />
        <div className="workspace-body">
          <Sidebar view={view} setView={setView} />
          <main className="content">
            {loadError && <div className="api-alert">{loadError}</div>}
            {loading && <div className="api-alert">Loading book review data...</div>}
            {!loading && view === "dashboard" && <Dashboard setView={setView} authors={authors} books={books} reviews={reviews} />}
            {!loading && view === "authors-list" && <AuthorsList authors={authors} setView={setView} setModal={setModal} />}
            {!loading && view === "books-list" && <BooksList books={books} setView={setView} setModal={setModal} />}
            {!loading && view === "reviews-list" && <ReviewsList reviews={reviews} setView={setView} setModal={setModal} />}
            {!loading && view === "authors-create" && <AuthorForm onSubmit={(payload) => mutate(() => api.createAuthor(payload), "authors-list")} />}
            {!loading && view === "books-create" && <BookForm authors={authors} onSubmit={(payload) => mutate(() => api.createBook(payload), "books-list")} />}
            {!loading && view === "reviews-create" && <ReviewForm books={books} onSubmit={(payload) => mutate(() => api.createReview(payload), "reviews-list")} />}
            {!loading && view === "profile" && <EmptyState title="Profile" text="Candidate profile settings placeholder for the entrance test shell." />}
          </main>
        </div>
      </section>
      {modal && <RecordModal modal={modal} authors={authors} books={books} onClose={() => setModal(null)} onMutate={mutate} />}
    </div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero-copy">
        <img className="hero-logo" src={logoUrl} alt="HAIBAZO" />
        <div className="hero-title-row">
          <div className="vertical-mark" />
          <h1>Manage books.<br />Inspire readers.</h1>
        </div>
        <p>A clean admin dashboard for authors, books, and reviews.</p>
        <a href="#workspace" className="primary-cta">Get started <span>→</span></a>
      </div>
      <img className="hero-books" src={heroBooksUrl} alt="" aria-hidden="true" />
    </header>
  );
}

function Topbar() {
  return (
    <div className="topbar" id="workspace">
      <button className="icon-button" aria-label="Open menu"><Icon name="menu" /></button>
      <img src={logoUrl} alt="HAIBAZO" />
      <div className="topbar-spacer" />
      <button className="notification" aria-label="Notifications"><Icon name="bell" /><span>3</span></button>
      <button className="admin-chip"><span className="avatar">A</span> Admin <span>⌄</span></button>
    </div>
  );
}

function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">
      {navGroups.map((group) => (
        <nav key={group.label} aria-label={group.label}>
          <p>{group.label}</p>
          {group.items.map((item) => (
            <button key={item.id} className={view.startsWith(item.id.split("-")[0]) ? "active" : ""} onClick={() => setView(item.id)}>
              <Icon name={item.icon} /> {item.label}
            </button>
          ))}
        </nav>
      ))}
      <div className="knowledge-card">
        <Icon name="book" />
        <strong>Share knowledge.<br />Grow together.</strong>
        <span>HAIBAZO BOOK REVIEW</span>
      </div>
    </aside>
  );
}

function Dashboard({ setView, authors, books, reviews }) {
  return (
    <div className="dashboard-grid">
      <div className="page-heading wide">
        <span>Dashboard</span>
        <h2>Library command center</h2>
        <p>Quickly move between the required entrance-test screens.</p>
      </div>
      <Metric label="Authors" value={authors.length} />
      <Metric label="Books" value={books.length} />
      <Metric label="Reviews" value={reviews.length} />
      {[
        ["Authors", "Manage writer records and book counts.", "authors-list"],
        ["Books", "Track titles and their assigned authors.", "books-list"],
        ["Reviews", "Capture reader feedback for each book.", "reviews-list"]
      ].map(([title, text, target]) => (
        <button key={target} className="route-card" onClick={() => setView(target)}>
          <span>{title}</span>
          <p>{text}</p>
          <b>Open →</b>
        </button>
      ))}
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function AuthorsList(props) {
  const [query, setQuery] = useState("");
  return <ListView title="Authors" createLabel="Create Author" rows={props.authors} columns={["No", "Name", "Books", "Actions"]} createView="authors-create" {...props} renderRow={(author, index) => (
    <tr key={author.id}>
      <td>{index + 1}</td>
      <td><span className="person"><b>{initials(author.name)}</b>{author.name}</span></td>
      <td>{author.books}</td>
      <td><RowActions onEdit={() => props.setModal({ mode: "edit", type: "authors", record: author })} onDelete={() => props.setModal({ mode: "delete", type: "authors", record: author })} /></td>
    </tr>
  )} query={query} setQuery={setQuery} />;
}

function BooksList(props) {
  const [query, setQuery] = useState("");
  return <ListView title="Books" createLabel="Create Book" rows={props.books} columns={["No", "Title", "Author", "Actions"]} createView="books-create" {...props} renderRow={(book, index) => (
    <tr key={book.id}>
      <td>{index + 1}</td>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td><RowActions onEdit={() => props.setModal({ mode: "edit", type: "books", record: book })} onDelete={() => props.setModal({ mode: "delete", type: "books", record: book })} /></td>
    </tr>
  )} query={query} setQuery={setQuery} />;
}

function ReviewsList(props) {
  const [query, setQuery] = useState("");
  return <ListView title="Reviews" createLabel="Create Review" rows={props.reviews} columns={["No", "Book", "Author", "Review", "Actions"]} createView="reviews-create" {...props} renderRow={(review, index) => (
    <tr key={review.id}>
      <td>{index + 1}</td>
      <td>{review.book}</td>
      <td>{review.author}</td>
      <td>{review.review}</td>
      <td><RowActions onEdit={() => props.setModal({ mode: "edit", type: "reviews", record: review })} onDelete={() => props.setModal({ mode: "delete", type: "reviews", record: review })} /></td>
    </tr>
  )} query={query} setQuery={setQuery} />;
}

function ListView({ title, createLabel, rows, columns, createView, query, setQuery, setView, renderRow }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return rows;
    return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(text));
  }, [query, rows]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedRows = filtered.slice(startIndex, startIndex + pageSize);
  const pageStartLabel = filtered.length === 0 ? 0 : startIndex + 1;
  const pageEndLabel = Math.min(startIndex + pageSize, filtered.length);
  const hasQuery = query.trim().length > 0;
  const description = getListDescription(title);

  useEffect(() => {
    setPage(1);
  }, [query, rows]);

  return (
    <div className="panel-stack list-panel">
      <div className="page-heading panel-heading">
        <div className="panel-heading-copy">
          <span>{title} › List</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="panel-summary" aria-label={`${title} summary`}>
          <div className="summary-card">
            <strong>{rows.length}</strong>
            <span>Total {title.toLowerCase()}</span>
          </div>
          <div className="summary-card">
            <strong>{filtered.length}</strong>
            <span>{hasQuery ? "Matching results" : "Visible results"}</span>
          </div>
        </div>
      </div>
      <div className="toolbar panel-toolbar">
        <label className="search-field">
          <Icon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />
        </label>
        <button className="solid-button" onClick={() => setView(createView)}><Icon name="plus" /> {createLabel}</button>
      </div>
      <div className="table-shell">
        <div className="table-intro">
          <div>
            <strong>{hasQuery ? `Results for "${query}"` : `${title} directory`}</strong>
            <p>{hasQuery ? `Showing ${filtered.length} matching records.` : `Browse and manage the latest ${title.toLowerCase()} in one place.`}</p>
          </div>
          <span className="table-badge">{currentPage}/{totalPages} pages</span>
        </div>
        <div className="table-card">
          <table>
            <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {pagedRows.length > 0 ? pagedRows.map((row, index) => renderRow(row, startIndex + index)) : (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="table-empty">
                      <strong>No {title.toLowerCase()} found</strong>
                      <p>{hasQuery ? "Try a shorter keyword or clear the search field." : `Create the first ${singular(createView.split("-")[0]).toLowerCase()} to populate this list.`}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <span>Showing {pageStartLabel} to {pageEndLabel} of {filtered.length} results</span>
        <div>
          <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>‹</button>
          {buildPageItems(currentPage, totalPages).map((item, index) => item === "ellipsis" ? (
            <button key={`ellipsis-${index}`} className="ellipsis" disabled>...</button>
          ) : (
            <button key={item} className={item === currentPage ? "current" : ""} onClick={() => setPage(item)}>{item}</button>
          ))}
          <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>›</button>
        </div>
      </div>
    </div>
  );
}

function buildPageItems(currentPage, totalPages) {
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

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button aria-label="Update" onClick={onEdit}><Icon name="edit" /></button>
      <button aria-label="Delete" className="danger" onClick={onDelete}><Icon name="trash" /></button>
    </div>
  );
}

function AuthorForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  async function submit() {
    if (!name.trim()) return setErrors({ name: "Please enter name" });
    await submitForm(() => onSubmit({ name: name.trim() }), setErrors);
  }
  return (
    <FormShell title="Authors › Create" lead="Create">
      <label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter author name" /></label>
      {errors.name && <p className="error">* {errors.name}</p>}
      <button className="solid-button align-right" onClick={submit}>Create</button>
      <ValidationNote text="Validation message shows after clicking Create with an empty name." />
    </FormShell>
  );
}

function BookForm({ authors, onSubmit }) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [errors, setErrors] = useState({});
  async function submit() {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Please enter name";
    if (!authorId) nextErrors.authorId = "Please select author";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    await submitForm(() => onSubmit({ title: title.trim(), authorId: Number(authorId) }), setErrors);
  }
  return (
    <FormShell title="Books › Create" lead="Create">
      <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter book title" /></label>
      {errors.title && <p className="error">* {errors.title}</p>}
      <label>Author<select value={authorId} onChange={(event) => setAuthorId(event.target.value)}><option value="">Select author</option>{authors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      {errors.authorId && <p className="error">* {errors.authorId}</p>}
      <button className="solid-button align-right" onClick={submit}>Create</button>
      <ValidationNote text="Create checks both title and author before saving." />
    </FormShell>
  );
}

function ReviewForm({ books, onSubmit }) {
  const [bookId, setBookId] = useState("");
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});
  async function submit() {
    const nextErrors = {};
    if (!bookId) nextErrors.bookId = "Please select book";
    if (!review.trim()) nextErrors.review = "Please enter review";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    await submitForm(() => onSubmit({ bookId: Number(bookId), review: review.trim() }), setErrors);
  }
  return (
    <FormShell title="Reviews › Create" lead="Create">
      <label>Book<select value={bookId} onChange={(event) => setBookId(event.target.value)}><option value="">Select book</option>{books.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      {errors.bookId && <p className="error">* {errors.bookId}</p>}
      <label>Review<textarea value={review} onChange={(event) => setReview(event.target.value)} placeholder="Enter your review" /></label>
      {errors.review && <p className="error">* {errors.review}</p>}
      <button className="solid-button align-right" onClick={submit}>Create</button>
      <ValidationNote text="Validation message shows after clicking Create with empty fields." />
    </FormShell>
  );
}

async function submitForm(action, setErrors) {
  try {
    setErrors({});
    await action();
  } catch (error) {
    setErrors(error.fields ?? { form: error.message });
  }
}

function FormShell({ title, lead, children }) {
  return (
    <div className="form-layout">
      <div className="page-heading">
        <span>{title}</span>
        <h2>{lead}</h2>
      </div>
      <div className="form-card">{children}</div>
    </div>
  );
}

function ValidationNote({ text }) {
  return <aside className="validation-note"><span></span>{text}</aside>;
}

function RecordModal({ modal, authors, books, onClose, onMutate }) {
  const { mode, type, record } = modal;
  const [draft, setDraft] = useState(record);
  const title = `${mode === "edit" ? "Update" : "Delete"} ${singular(type)}`;

  async function apply() {
    const actions = {
      authors: () => api.updateAuthor(record.id, { name: draft.name }),
      books: () => api.updateBook(record.id, { title: draft.title, authorId: Number(draft.authorId) }),
      reviews: () => api.updateReview(record.id, { bookId: Number(draft.bookId), review: draft.review })
    };
    await onMutate(actions[type]);
    onClose();
  }

  async function remove() {
    const actions = {
      authors: () => api.deleteAuthor(record.id),
      books: () => api.deleteBook(record.id),
      reviews: () => api.deleteReview(record.id)
    };
    await onMutate(actions[type]);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <header><h3>{title}</h3><button onClick={onClose} aria-label="Close"><Icon name="close" /></button></header>
        {mode === "delete" ? (
          <div className="delete-panel">
            <div className="delete-icon"><Icon name="trash" /></div>
            <p>Are you sure you want to delete this {singular(type).toLowerCase()}?</p>
            <footer><button onClick={onClose}>Cancel</button><button className="delete-button" onClick={remove}>Delete</button></footer>
          </div>
        ) : (
          <div className="modal-form">
            {type === "authors" && <label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>}
            {type === "books" && <><label>Title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label><label>Author<select value={draft.authorId} onChange={(event) => setDraft({ ...draft, authorId: event.target.value })}>{authors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></>}
            {type === "reviews" && <><label>Book<select value={draft.bookId} onChange={(event) => setDraft({ ...draft, bookId: event.target.value })}>{books.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label>Review<textarea value={draft.review} onChange={(event) => setDraft({ ...draft, review: event.target.value })} /></label></>}
            <footer><button onClick={onClose}>Cancel</button><button className="solid-button" onClick={apply}>Update</button></footer>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, text }) {
  return <div className="empty-state"><h2>{title}</h2><p>{text}</p></div>;
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function singular(type) {
  return type === "authors" ? "Author" : type === "books" ? "Book" : "Review";
}

function getListDescription(title) {
  if (title === "Authors") return "Keep author records, book counts, and quick actions easy to scan.";
  if (title === "Books") return "Review book entries and author assignments without visual clutter.";
  return "Read, update, and organize reader feedback with a clearer review workspace.";
}
