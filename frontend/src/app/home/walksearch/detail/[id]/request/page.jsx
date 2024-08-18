"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../../../../../utils/useAuth";

export default function WalkSearchDetailRequest() {
  const { id } = useParams();
  const router = useRouter();
  const isAuthenticated = useAuth();
  const [walkDetail, setWalkDetail] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetch(`${process.env.API_ENDPOINT}/api/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user_id) {
            setUserId(data.user_id);
          }
        })
        .catch((error) => console.error("Error fetching user info:", error));

      fetch(`${process.env.API_ENDPOINT}/api/walks/${id}`)
        .then((response) => response.json())
        .then((data) => setWalkDetail(data))
        .catch((error) => console.error("Error fetching walk detail:", error));
    }
  }, [isAuthenticated, id]);

  const handleRequest = () => {
    if (!walkDetail || !userId) return;

    const requestData = {
      walk_id: id,
      requested_time: walkDetail.time_start,
    };

    fetch(`${process.env.API_ENDPOINT}/api/request_walk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          alert("リクエストが送信されました");
          router.push("/home/walksearch");
        } else {
          return response.json().then((data) => {
            if (data.error === "Not enough points") {
              alert("ポイントが不足しています。");
            } else {
              alert("申請に失敗しました。再度お試しください。");
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error requesting walk:", error);
        alert("申請に失敗しました。再度お試しください。");
      });
  };

  // walkDetailがnullの場合の処理を追加
  if (!walkDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-16 px-4">
      <main className="flex-1 overflow-y-auto w-full">
        <h2 className="text-xl font-bold text-center mb-6">
          この内容で申請しますか？
        </h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">日時</h3>
          <p className="text-sm text-gray-700">
            {walkDetail.date} {walkDetail.time_start}〜{walkDetail.time_end}
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-4">場所</h3>
          <p className="text-sm text-gray-700">{walkDetail.location}</p>

          <h3 className="text-lg font-semibold mb-2 mt-4">わんちゃん</h3>
          {walkDetail.dogs.map((dog, index) => (
            <p key={index} className="text-sm text-gray-700">
              {dog.name} / {dog.breed} / {dog.age}歳 / {dog.gender}
            </p>
          ))}

          {/* ポイント数の表示 */}
          <div className="mt-4 text-sm text-gray-700 flex items-center">
            <div className="w-6 h-6 bg-[#75A05A] text-white font-bold rounded-full flex items-center justify-center mr-2">
              P
            </div>
            <span>必要ポイント: {walkDetail.points_required}</span>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="bg-[#75A05A] text-white py-2 px-6 rounded-full font-semibold transition-transform transform hover:scale-105"
            onClick={handleRequest}
          >
            リクエスト送信
          </button>
        </div>
      </main>
    </div>
  );
}
