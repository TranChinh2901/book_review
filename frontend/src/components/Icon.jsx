export function Icon({ name }) {
  const icons = {
    menu: (
      <>
        <path d="M5 7h14" />
        <path d="M5 12h14" />
        <path d="M5 17h14" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c1.3-4 12.7-4 14 0" />
      </>
    ),
    book: (
      <>
        <path d="M5 5.5c3-1.2 5.2-.7 7 1v13c-1.8-1.7-4-2.2-7-1V5.5Z" />
        <path d="M19 5.5c-3-1.2-5.2-.7-7 1v13c1.8-1.7 4-2.2 7-1V5.5Z" />
      </>
    ),
    shield: <path d="M12 3 19 6v5c0 4.2-2.8 7.4-7 10-4.2-2.6-7-5.8-7-10V6l7-3Z" />,
    circle: <circle cx="12" cy="12" r="7" />,
    edit: <path d="M5 18.5 6 14l8.8-8.8a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L10 18l-5 .5Z" />,
    trash: (
      <>
        <path d="M6 7h12" />
        <path d="M9 7V5h6v2" />
        <path d="M8 10v9h8v-9" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z" />
        <path d="M10 21h4" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
