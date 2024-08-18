"use client";

import "./globals.css";
import React, { useEffect, useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";

export default function RootLayout({ children }) {
  const [shouldHideFooter, setShouldHideFooter] = useState(false);

  useEffect(() => {
    const hideFooterPaths = [
      "/login",
      "/new",
      "/",
      "/new/visitor",
      "/new/owner",
    ];

    const handleRouteChange = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        setShouldHideFooter(hideFooterPaths.includes(path));
        console.log("Current path:", path);
      }
    };

    // 初期ロード時に一度非表示にする（リセット）
    setShouldHideFooter(false);

    // 初期ロード時に現在のパスをチェック
    handleRouteChange();

    // 100ms後に再度フッターとヘッダーの表示を確認
    setTimeout(handleRouteChange, 100);

    // ブラウザの戻る・進むボタンに対応
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        {!shouldHideFooter && <Header />}
        <main className="flex-1">{children}</main>
        {!shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}
