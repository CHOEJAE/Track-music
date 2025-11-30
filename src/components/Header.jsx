import WebBrainLogo from "./icons/WebBrainLogo.jsx";
import Personicon from "./icons/personicon.jsx";
export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-mark">
          <WebBrainLogo size={24} />
        </div>
        <span className="logo-text">웹브레인</span>
      </div>

      <div className="header-right">
        {/* 나중에 마이페이지/설정으로 라우팅할 버튼 */}
        <button className="icon-button" aria-label="설정">
          <Personicon size={24}/>
        </button>
      </div>
    </header>
  );
}
