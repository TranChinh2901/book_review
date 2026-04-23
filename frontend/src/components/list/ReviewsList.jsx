import { ListView } from "./ListView.jsx";
import { RowActions } from "./RowActions.jsx";

export function ReviewsList({ reviews, setView, setModal }) {
  return (
    <ListView
      title="Reviews"
      createLabel="Create Review"
      rows={reviews}
      columns={["No", "Book", "Author", "Review", "Actions"]}
      createView="reviews-create"
      setView={setView}
      renderRow={(review, index) => (
        <tr key={review.id}>
          <td>{index + 1}</td>
          <td>{review.book}</td>
          <td>{review.author}</td>
          <td>{review.review}</td>
          <td>
            <RowActions
              onEdit={() => setModal({ mode: "edit", type: "reviews", record: review })}
              onDelete={() => setModal({ mode: "delete", type: "reviews", record: review })}
            />
          </td>
        </tr>
      )}
    />
  );
}
