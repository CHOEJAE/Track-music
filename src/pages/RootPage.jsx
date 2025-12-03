import React from "react";
import { Link } from "react-router-dom";

function RootPage() {
  return (
    <div className="relative flex h-screen text-white p-8 md:pl-16 md:pr-0 overflow-hidden">
      {/*배경 그라데이션 원 (데코레이션 요소)왼쪽 하단 */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 md:w-[400px] md:h-[400px] 
                   bg-linear-to-l from-red-900/60 to-red-700/40 rounded-full 
                   filter blur-3xl opacity-40"
      ></div>

      {/*왼쪽 섹션 (서비스 정보 및 버튼) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl pl-0 pt-16 pb-16 md:pt-0 md:pb-0">
        <h1
          className="
            text-6xl sm:text-7xl font-extrabold tracking-tight mb-4
            bg-linear-to-l from-red-500 to-red-900
            bg-clip-text text-transparent
        "
        >
          음악추천 서비스
        </h1>

        {/* 간단한 설명 */}
        <p className="text-gray-300 text-2xl leading-relaxed mb-5">
          당신의 음악을 가장 깊게 이해하는{" "}
          <span className="text-red-500 font-bold">AI</span>
        </p>

        <p className="text-gray-400 text-lg mb-10 max-w-md">
          웹브레인 서비스는 음원의 구간·파트를 분석해 <br />
          가장 유사한 음악을 찾아주는 AI 서비스입니다.
        </p>

        {/*버튼*/}
        <Link
          to="/home"
          className="
              w-48 text-center px-8 py-4
              text-gray-300 text-xl font-semibold
              rounded-full shadow-xl
              bg-linear-to-l from-red-600 to-red-900
              hover:from-red-700 hover:to-red-950
              transition duration-300
          "
        >
          시작하기
        </Link>
      </div>

      {/*오른쪽 섹션 (이미지)*/}
      <div className="relative z-10 hidden md:flex flex-1 items-center justify-center overflow-visible">
        <div
          className="
            relative 
            w-[120%]     /* 화면보다 40% 더 크게 꽉 채우기 */
            h-[130%] 
            -right-20    /* 왼쪽으로 밀어서 더 겹치게 */
            -rotate-6    /* 기울이기 */
            rounded-3xl 
            shadow-2xl 
            overflow-hidden 
            bg-gray-800 
            "
        >
          <img
            src="./root_music.jpg"
            alt="root image"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

export default RootPage;
