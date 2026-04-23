function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const dashboardRoutes = [
  ["Authors", "Manage writer records and book counts.", "authors-list"],
  ["Books", "Track titles and their assigned authors.", "books-list"],
  ["Reviews", "Capture reader feedback for each book.", "reviews-list"]
];

export function Dashboard({ setView, authors, books, reviews }) {
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
      {dashboardRoutes.map(([title, text, target]) => (
        <button key={target} className="route-card" onClick={() => setView(target)}>
          <span>{title}</span>
          <p>{text}</p>
          <b>Open →</b>
        </button>
      ))}
    </div>
  );
}
