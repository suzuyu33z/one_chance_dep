"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">メールアドレス</label>
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
            <label className="block text-gray-700 font-medium mb-2">パスワード</label>
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
            className="w-full bg-[#A8D38D] text-white py-3 rounded-lg font-semibold hover:bg-[#96c781] transition-colors shadow-md"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
