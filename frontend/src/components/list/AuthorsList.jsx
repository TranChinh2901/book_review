import { initials } from "../../utils/library.js";
import { ListView } from "./ListView.jsx";
import { RowActions } from "./RowActions.jsx";

export function AuthorsList({ authors, setView, setModal }) {
  return (
    <ListView
      title="Authors"
      createLabel="Create Author"
      rows={authors}
      columns={["No", "Name", "Books", "Actions"]}
      createView="authors-create"
      setView={setView}
      renderRow={(author, index) => (
        <tr key={author.id}>
          <td>{index + 1}</td>
          <td>
            <span className="person">
              <b>{initials(author.name)}</b>
              {author.name}
            </span>
          </td>
          <td>{author.books}</td>
          <td>
            <RowActions
              onEdit={() => setModal({ mode: "edit", type: "authors", record: author })}
              onDelete={() => setModal({ mode: "delete", type: "authors", record: author })}
            />
          </td>
        </tr>
      )}
    />
  );
}
