"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "../globals.css"; // グローバルCSSをインポート

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 40; // スクロールのしきい値を設定

  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // ユーザー情報を取得
    fetch(`${process.env.API_ENDPOINT}/api/user-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // クッキーを含める
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setUserInfo(data);
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header
      className={`bg-white py-0 px-2 border-b-2 border-[#c5e1a5] text-center fixed top-0 w-full z-[1000] flex justify-between items-center duration-100 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center">
        <svg width="220" height="40" viewBox="0 10 220 40">
          <defs>
            <path id="curve" d="M 10,40 Q 100,20 190,40" />
          </defs>
          <text
            width="220"
            style={{
              fontFamily: "Kosugi Maru, sans-serif",
              fill: "#75A05A",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "-0.5px",
              textDecoration: "underline",
            }}
          >
            <textPath xlinkHref="#curve" dy={-5}>
              わん^Chance^アイドル
            </textPath>
          </text>
        </svg>
        {userInfo && (
          <div className="ml-4 text-xs">
            <p>{`ユーザー名: ${userInfo.name}`}</p>
            <p>{`ポイント: ${userInfo.points}`}</p>
          </div>
        )}
      </div>
      <div className="relative" ref={menuRef}>
        <span
          className="material-icons text-[#75A05A] text-2xl cursor-pointer"
          onClick={toggleMenu}
        >
          menu
        </span>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <ul className="py-1">
              <li>
                <Link href="/use-points" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  ポイントを使う
                </Link>
              </li>
              <li>
                <Link href="/buy-points" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  ポイント購入
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  お気に入り
                </Link>
              </li>
              <li>
                <Link href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  ログアウト
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
