"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./globals.css";

export default function Top() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // APIエンドポイントにPOSTリクエストを送信
    const response = await fetch(process.env.API_ENDPOINT + `/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // フォームデータをJSONに変換して送信
      credentials: "include", // <-- これが重要
    });

    if (response.ok) {
      const data = await response.json();
      // ホームページへリダイレクト
      router.push("/home");
    } else {
      console.error("Login failed.");
      // ログイン失敗時のエラーハンドリング
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* ヘッダー部分 */}
      <header
        className={`bg-white py-0 px-2 border-b-2 border-[#c5e1a5] text-center fixed top-0 w-full z-[1000] flex justify-between items-center duration-100`}
      >
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
      </header>

      {/* コンテンツ部分 */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 pt-16">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          わんちゃんと、特別な体験を。
        </h1>
        <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#A8D38D] focus:border-transparent"
                placeholder="例: user@example.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#A8D38D] focus:border-transparent"
                placeholder="例: ********"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#75A05A] text-white py-3 rounded-lg font-semibold hover:bg-[#679150] transition-colors shadow-md"
            >
              ログイン
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/new" className="text-[#75A05A] hover:underline">
              新規登録はこちら
            </Link>
          </div>
        </div>
      </main>

      {/* フッター部分 */}
      <footer className="w-full py-6 bg-gray-200 text-center text-gray-500 text-sm shadow-inner">
        &copy; 2024 わん-Chance-アイドル. All rights reserved.
      </footer>
    </div>
  );
}
