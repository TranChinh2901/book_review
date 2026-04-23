export function FormShell({ title, lead, children }) {
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

export function ValidationNote({ text }) {
  return (
    <aside className="validation-note">
      <span></span>
      {text}
    </aside>
  );
}

export function FormError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="error">* {message}</p>;
}
