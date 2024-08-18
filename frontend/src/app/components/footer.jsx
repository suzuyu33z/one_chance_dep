"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import '../globals.css'; // グローバルCSSをインポート

export default function Footer() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 40; // スクロールのしきい値を設定

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          // 下にスクロール
          setIsVisible(false);
        } else {
          // 上にスクロール
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  return (
    <footer className={`bg-[#A8D38D] py-2 px-0.5 border-t-2 border-[#c5e1a5] text-center fixed bottom-0 w-full z-[1000] overflow-x-auto transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <ul className="list-none flex justify-around items-center w-full p-0 m-0 flex-nowrap">
        <Link href="/home">
          <li className="cursor-pointer flex-1 text-center min-w-[20px] whitespace-nowrap text-white flex flex-col items-center text-shadow font-bold text-xs">
            <span className="material-icons">home</span>
            <p>ホーム</p>
          </li>
        </Link>
        <Link href="/home/history">
          <li className="cursor-pointer flex-1 text-center min-w-[20px] whitespace-nowrap text-white flex flex-col items-center text-shadow font-bold text-xs">
            <span className="material-icons">history</span>
            <p>マッチ履歴</p>
          </li>
        </Link>
        <Link href="/home/walksearch">
          <li className="cursor-pointer flex-1 text-center min-w-[20px] whitespace-nowrap text-white flex flex-col items-center text-shadow font-bold text-xs">
            <span className="material-icons">search</span>
            <p>犬検索</p>
          </li>
        </Link>
        <Link href="/home/walkregi">
          <li className="cursor-pointer flex-1 text-center min-w-[20px] whitespace-nowrap text-white flex flex-col items-center text-shadow font-bold text-xs">
            <span className="material-icons">pets</span>
            <p>散歩登録</p>
          </li>
        </Link>
        <Link href="/home/edition">
          <li className="cursor-pointer flex-1 text-center min-w-[20px] whitespace-nowrap text-white flex flex-col items-center text-shadow font-bold text-xs">
            <span className="material-icons">person</span>
            <p>プロフ変更</p>
          </li>
        </Link>
      </ul>
    </footer>
  );
}
