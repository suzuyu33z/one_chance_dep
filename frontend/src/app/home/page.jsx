"use client";
import React, { useState, useEffect } from "react";
import WalkInfoCard from "../components/walk_info_card";
import useAuth from "../utils/useAuth"; // カスタムフックをインポート

export default function UserWalkListPage() {
  const isAuthenticated = useAuth(); // 認証状態を取得
  const [walks, setWalks] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // ページロード状態

  useEffect(() => {
    if (isAuthenticated) {
      // ログインしている場合のみデータを取得
      fetch(`${process.env.API_ENDPOINT}/api/all_user_walks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // セッションを含める
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched walks data:", data); // 取得したデータを表示

          // 日付と開始時間でソート
          const sortedWalks = data.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time_start}`);
            const dateB = new Date(`${b.date}T${b.time_start}`);
            return dateB - dateA; // 新しい順にソート
          });

          setWalks(sortedWalks);
        })
        .catch((error) => console.error("Error fetching user walks:", error));
    }
    setIsPageLoaded(true); // ページがロードされたことをマーク
  }, [isAuthenticated]);

  return (
          <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 overflow-y-auto w-full mt-16">
              <div className="flex flex-col items-center px-4 pt-4 pb-8 max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">次回のわんちゃん予定</h2>

                {/* WalkInfoCardを表示 */}
                {walks.length > 0 ? (
                  walks.map((walk, index) => (
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

                {/* 今週の人気犬ランキング */}
                <div className="w-full mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">今週の人気犬ランキング</h3>
                  <div className="space-y-4">
                    <div className="flex items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                      <span className="text-xl font-bold text-gray-800 mr-3">1</span>
                      <img src="/images/popular_dog1.png" alt="Popular Dog 1" className="w-14 h-14 object-cover rounded-full mr-4" />
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-800">ZERO</h4>
                        <p className="text-yellow-500 text-md">★★★★☆ (4.5)</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                      <span className="text-xl font-bold text-gray-800 mr-3">2</span>
                      <img src="/images/popular_dog2.png" alt="Popular Dog 2" className="w-14 h-14 object-cover rounded-full mr-4" />
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-800">恵比寿のアイドル：ハチコ</h4>
                        <p className="text-yellow-500 text-md">★★★★☆ (4.3)</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                      <span className="text-xl font-bold text-gray-800 mr-3">3</span>
                      <img src="/images/popular_dog3.png" alt="Popular Dog 3" className="w-14 h-14 object-cover rounded-full mr-4" />
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-800">ポッキー（登録１０００人越え大感謝キャンペーン中！）</h4>
                        <p className="text-yellow-500 text-md">★★★★☆ (4.2)</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-right w-full">
                    <a href="#" className="text-blue-600 hover:underline text-sm">もっと見る</a>
                  </div>
                </div>

                {/* 新着わんちゃん紹介 */}
                <div className="w-full mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">新着わんちゃん</h3>
                  <div className="flex space-x-4 overflow-x-auto">
                    <div className="bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition-shadow duration-300 w-28">
                      <img src="/images/dog1.png" alt="New Dog 1" className="w-14 h-14 object-cover rounded-full mx-auto" />
                      <h4 className="text-xs font-medium mt-2 text-gray-800 text-center">トフィー <span className="text-red-500 italic">NEW!</span></h4>
                      <p className="text-gray-600 text-xs text-center">2歳</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition-shadow duration-300 w-28">
                      <img src="/images/dog2.png" alt="New Dog 2" className="w-14 h-14 object-cover rounded-full mx-auto" />
                      <h4 className="text-xs font-medium mt-2 text-gray-800 text-center">ベル <span className="text-red-500 italic">NEW!</span></h4>
                      <p className="text-gray-600 text-xs text-center">3歳</p>
                    </div>
                    {/* More dog cards... */}
                  </div>
                  <div className="mt-4 text-right w-full">
                    <a href="#" className="text-blue-600 hover:underline text-sm">もっと見る</a>
                  </div>
                </div>

                {/* 特集セクション */}
                <div className="w-full mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">特集：夏の恵比寿ガーデンプレイス</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800">夏の夜、ブルーノートとわんちゃんと過ごす恵比寿</h4>
                    <p className="text-gray-700 mt-2 text-sm">
                      夏の恵比寿ガーデンプレイスで、ブルーノートの心地よいジャズを聴きながら、わんちゃんとの特別な夜を過ごしませんか？
                      詳しくは <a href="https://www.bluenoteplace.jp" className="text-blue-600 hover:underline">こちら</a> で確認できます。
                    </p>
                  </div>
                </div>

                {/* お得なキャンペーンや割引情報 */}
                <div className="w-full mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">お得なキャンペーンや割引情報</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800">新規登録者向けキャンペーン</h4>
                    <p className="text-gray-700 mt-2 text-sm">
                      今なら新規登録で初回のわんちゃん体験が50%オフ！詳細はこちらから。
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>

  );
}
