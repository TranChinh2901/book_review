import { useState } from "react";
import { Dashboard } from "./components/dashboard/Dashboard.jsx";
import { AuthorForm } from "./components/forms/AuthorForm.jsx";
import { BookForm } from "./components/forms/BookForm.jsx";
import { ReviewForm } from "./components/forms/ReviewForm.jsx";
import { Hero } from "./components/layout/Hero.jsx";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import { Topbar } from "./components/layout/Topbar.jsx";
import { AuthorsList } from "./components/list/AuthorsList.jsx";
import { BooksList } from "./components/list/BooksList.jsx";
import { ReviewsList } from "./components/list/ReviewsList.jsx";
import { RecordModal } from "./components/modal/RecordModal.jsx";
import { EmptyState } from "./components/shared/EmptyState.jsx";
import { useLibraryData } from "./hooks/useLibraryData.js";
import { api } from "./api.js";

export default function App() {
  const [view, setView] = useState("authors-list");
  const [modal, setModal] = useState(null);
  const { authors, books, reviews, loading, loadError, reload } = useLibraryData();

  async function mutate(action, nextView) {
    await action();
    await reload();

    if (nextView) {
      setView(nextView);
    }
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
            {!loading && renderActiveView({ view, setView, setModal, mutate, authors, books, reviews })}
          </main>
        </div>
      </section>
      {modal && (
        <RecordModal
          modal={modal}
          authors={authors}
          books={books}
          onClose={() => setModal(null)}
          onMutate={mutate}
        />
      )}
    </div>
  );
}

function renderActiveView({ view, setView, setModal, mutate, authors, books, reviews }) {
  switch (view) {
    case "dashboard":
      return <Dashboard setView={setView} authors={authors} books={books} reviews={reviews} />;
    case "authors-list":
      return <AuthorsList authors={authors} setView={setView} setModal={setModal} />;
    case "books-list":
      return <BooksList books={books} setView={setView} setModal={setModal} />;
    case "reviews-list":
      return <ReviewsList reviews={reviews} setView={setView} setModal={setModal} />;
    case "authors-create":
      return <AuthorForm onSubmit={(payload) => mutate(() => api.createAuthor(payload), "authors-list")} />;
    case "books-create":
      return <BookForm authors={authors} onSubmit={(payload) => mutate(() => api.createBook(payload), "books-list")} />;
    case "reviews-create":
      return <ReviewForm books={books} onSubmit={(payload) => mutate(() => api.createReview(payload), "reviews-list")} />;
    case "profile":
      return <EmptyState title="Profile" text="Candidate profile settings placeholder for the entrance test shell." />;
    default:
      return <EmptyState title="Not found" text="This workspace view is not available." />;
  }
}
