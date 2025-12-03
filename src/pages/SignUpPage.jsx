import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  /**회원가입 핸들러 함수, 후에 백엔드 패치 결합 */
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("회원가입 시도");
    navigate("/login");
  };

  return (
    // 전체 컨테이너
    <div className="relative flex items-center justify-center h-screen bg-black text-white overflow-hidden p-4">
      {/* 왼쪽 상단 그라데이션 원 */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] 
                   bg-linear-to-br from-red-800/60 to-red-600/30 rounded-full 
                   filter blur-3xl opacity-60 transition-all duration-1000"
        style={{ transform: "translate(-50%, -10%)" }}
      ></div>

      {/* 오른쪽 하단 그라데이션 원 */}
      <div
        className="absolute bottom-0 right-0 w-80 h-80 
                   bg-linear-to-tl from-red-600/50 to-red-900/40 rounded-full 
                   filter blur-3xl opacity-50 transition-all duration-1000"
        style={{ transform: "translate(20%, 20%)" }}
      ></div>

      {/* 왼쪽 상단 작은 원 */}
      <div
        className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full 
                   bg-red-500 filter blur-sm opacity-50"
      ></div>

      {/* 회원가입 폼 */}
      <div className="relative z-10 w-full max-w-md p-10 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800">
        <h2
          className="text-5xl font-bold text-left mb-10 p-5 pl-0 
                     bg-linear-to-l from-red-500 to-red-900 
                     bg-clip-text text-transparent"
        >
          Create <br />
          Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 이메일 박스 */}
          <div className="mb-5">
            <input
              type="email"
              id="signup-email"
              placeholder="e-mail"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
                         focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
            />
          </div>

          {/* 패스워드 박스 */}
          <div className="mb-10">
            <input
              type="password"
              id="signup-password"
              placeholder="password"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
                         focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
            />
          </div>

          {/* 닉네임 박스 */}
          <div className="mb-10">
            <input
              type="text"
              id="signup-nickname"
              placeholder="nickname"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
                         focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-red-600 to-red-800 text-white 
                       rounded-md font-bold text-lg tracking-wider 
                       hover:from-red-700 hover:to-red-900 transition duration-300 
                       focus:outline-none focus:ring-1"
          >
            SIGN UP
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-red-400 transition duration-200"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
