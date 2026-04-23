import { useEffect, useMemo, useState } from "react";
import { buildPageItems, getListDescription, singular } from "../../utils/library.js";
import { Icon } from "../Icon.jsx";

const PAGE_SIZE = 5;

export function ListView({ title, createLabel, rows, columns, createView, setView, renderRow }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const description = getListDescription(title);
  const hasQuery = query.trim().length > 0;

  const filteredRows = useMemo(() => {
    const text = query.trim().toLowerCase();

    if (!text) {
      return rows;
    }

    return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(text));
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filteredRows.slice(startIndex, startIndex + PAGE_SIZE);
  const pageStartLabel = filteredRows.length === 0 ? 0 : startIndex + 1;
  const pageEndLabel = Math.min(startIndex + PAGE_SIZE, filteredRows.length);

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
          <SummaryCard value={rows.length} label={`Total ${title.toLowerCase()}`} />
          <SummaryCard value={filteredRows.length} label={hasQuery ? "Matching results" : "Visible results"} />
        </div>
      </div>

      <div className="toolbar panel-toolbar">
        <label className="search-field">
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </label>
        <button className="solid-button" onClick={() => setView(createView)}>
          <Icon name="plus" />
          {createLabel}
        </button>
      </div>

      <div className="table-shell">
        <div className="table-intro">
          <div>
            <strong>{hasQuery ? `Results for "${query}"` : `${title} directory`}</strong>
            <p>
              {hasQuery
                ? `Showing ${filteredRows.length} matching records.`
                : `Browse and manage the latest ${title.toLowerCase()} in one place.`}
            </p>
          </div>
          <span className="table-badge">
            {currentPage}/{totalPages} pages
          </span>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {pageRows.length > 0 ? (
                pageRows.map((row, index) => renderRow(row, startIndex + index))
              ) : (
                <EmptyTableState
                  title={title}
                  createView={createView}
                  columnCount={columns.length}
                  hasQuery={hasQuery}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <span>
          Showing {pageStartLabel} to {pageEndLabel} of {filteredRows.length} results
        </span>
        <div>
          <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>
            ‹
          </button>
          {buildPageItems(currentPage, totalPages).map((item, index) =>
            item === "ellipsis" ? (
              <button key={`ellipsis-${index}`} className="ellipsis" disabled>
                ...
              </button>
            ) : (
              <button
                key={item}
                className={item === currentPage ? "current" : ""}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ value, label }) {
  return (
    <div className="summary-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function EmptyTableState({ title, createView, columnCount, hasQuery }) {
  return (
    <tr>
      <td colSpan={columnCount}>
        <div className="table-empty">
          <strong>No {title.toLowerCase()} found</strong>
          <p>
            {hasQuery
              ? "Try a shorter keyword or clear the search field."
              : `Create the first ${singular(createView.split("-")[0]).toLowerCase()} to populate this list.`}
          </p>
        </div>
      </td>
    </tr>
  );
}
