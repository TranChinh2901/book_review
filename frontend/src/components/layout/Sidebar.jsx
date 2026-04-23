import { navGroups } from "../../constants/navigation.js";
import { Icon } from "../Icon.jsx";

export function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">
      {navGroups.map((group) => (
        <nav key={group.label} aria-label={group.label}>
          <p>{group.label}</p>
          {group.items.map((item) => (
            <button
              key={item.id}
              className={isActiveItem(view, item.id) ? "active" : ""}
              onClick={() => setView(item.id)}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
      ))}
      <div className="knowledge-card">
        <Icon name="book" />
        <strong>
          Share knowledge.
          <br />
          Grow together.
        </strong>
        <span>HAIBAZO BOOK REVIEW</span>
      </div>
    </aside>
  );
}

function isActiveItem(currentView, itemId) {
  return currentView.startsWith(itemId.split("-")[0]);
}
