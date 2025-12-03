import { useNavigate } from "react-router-dom";
import WebBrainLogo from "./icons/WebBrainLogo.jsx";
import Personicon from "./icons/Personicon.jsx";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <div className="logo-mark">
          <WebBrainLogo />
        </div>
        <span className="app-header-title">웹브레인</span>
      </div>

      <div className="app-header-right">
        <button
          type="button"
          className="profile-icon-button"
          onClick={() => navigate("/profile")}
        >
          <Personicon />
        </button>
      </div>
    </header>
  );
}
