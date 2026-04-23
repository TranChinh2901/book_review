import { ListView } from "./ListView.jsx";
import { RowActions } from "./RowActions.jsx";

export function BooksList({ books, setView, setModal }) {
  return (
    <ListView
      title="Books"
      createLabel="Create Book"
      rows={books}
      columns={["No", "Title", "Author", "Actions"]}
      createView="books-create"
      setView={setView}
      renderRow={(book, index) => (
        <tr key={book.id}>
          <td>{index + 1}</td>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>
            <RowActions
              onEdit={() => setModal({ mode: "edit", type: "books", record: book })}
              onDelete={() => setModal({ mode: "delete", type: "books", record: book })}
            />
          </td>
        </tr>
      )}
    />
  );
}
