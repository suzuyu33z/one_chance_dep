"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import WalkInfoCard from "../../components/walk_info_card";
import useAuth from "../../utils/useAuth"; // useAuthフックをインポート

export default function WalkListPage() {
  const isAuthenticated = useAuth(); // 認証状態を確認
  const [walks, setWalks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      // ログインしている場合のみデータを取得
      fetch(process.env.API_ENDPOINT + "/api/walks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setWalks(data))
        .catch((error) => console.error("Error fetching walks:", error));
    }
  }, [isAuthenticated]);

  // 検索ワードに基づいてデータをフィルタリング
  const filteredWalks = walks.filter((walk) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      walk.date.includes(searchTermLower) ||
      walk.location.toLowerCase().includes(searchTermLower) ||
      walk.dogs.some((dog) =>
        `${dog.name} ${dog.breed} ${dog.age}歳 ${dog.gender}`
          .toLowerCase()
          .includes(searchTermLower)
      )
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto w-full mt-8">
        <div className="flex flex-col items-center px-4 pt-4 pb-8">
          {/* 検索ボックス */}
          <input
            type="text"
            placeholder="検索"
            className="w-full p-2 rounded-md border border-gray-300 mb-4 text-black bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* フィルタリングされたWalkInfoCardを表示 */}
          {filteredWalks.length > 0 ? (
            filteredWalks.map((walk, index) => (
              <WalkInfoCard
                key={index}
                date={walk.date}
                time={`${walk.time_start}〜${walk.time_end}`} // 時間を表示
                location={walk.location}
                dogs={walk.dogs}
                walkId={walk.walk_id}
                pointsRequired={walk.points_required} // ここに必要ポイントを追加
              />
            ))
          ) : (
            <p className="text-gray-500">該当する結果が見つかりません。</p>
          )}
        </div>
      </main>
    </div>
  );
}
