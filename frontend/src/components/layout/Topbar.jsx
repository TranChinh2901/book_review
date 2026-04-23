import logoUrl from "../../assets/haibazo-logo.png";
import { Icon } from "../Icon.jsx";

export function Topbar() {
  return (
    <div className="topbar" id="workspace">
      <button className="icon-button" aria-label="Open menu">
        <Icon name="menu" />
      </button>
      <img src={logoUrl} alt="HAIBAZO" />
      <div className="topbar-spacer" />
      <button className="notification" aria-label="Notifications">
        <Icon name="bell" />
        <span>3</span>
      </button>
      <button className="admin-chip">
        <span className="avatar">A</span>
        Admin
        <span>⌄</span>
      </button>
    </div>
  );
}
