"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../../../../utils/useAuth";
import DogInfo from "../../../../components/doginfo";
import WalkDetail from "../../../../components/walkdetail";
import OwnerInfo from "../../../../components/ownerinfo";
import CommentsSection from "../../../../components/commentssection";

export default function WalkDetailPage() {
  const isAuthenticated = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [walkDetail, setWalkDetail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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

      fetch(`${process.env.API_ENDPOINT}/api/walks/${id}/messages`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [isAuthenticated, id]);

  const handleSendMessage = () => {
    if (newMessage.trim() && userId) {
      const messageData = {
        walk_id: id,
        message: newMessage,
        sender_user_id: userId,
      };

      fetch(`${process.env.API_ENDPOINT}/api/walks/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages([...messages, data]);
          setNewMessage("");
        })
        .catch((error) => console.error("Error sending message:", error));
    }
  };

  const handleRequest = () => {
    router.push(`/home/walksearch/detail/${id}/request`);
  };

  if (!walkDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-4">
      <main className="flex-1 w-full px-6 py-8 mb-24">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <DogInfo dogs={walkDetail.dogs} />
            <div className="mt-6">
              <WalkDetail
                date={walkDetail.date}
                time_start={walkDetail.time_start}
                time_end={walkDetail.time_end}
                location={walkDetail.location}
                description={walkDetail.description}
              />
              {/* ポイント数を表示 */}
              <div className="mt-4 text-sm text-gray-700 flex items-center">
                <div className="w-6 h-6 bg-[#75A05A] text-white font-bold rounded-full flex items-center justify-center mr-2">
                  P
                </div>
                <span>必要ポイント: {walkDetail.points_required}</span>
              </div>
            </div>
          </div>
          <OwnerInfo
            ownerName={walkDetail.owner_name}
            ownerBio={walkDetail.owner_bio}
          />
        </div>
        <CommentsSection
          messages={messages}
          userId={userId}
          newMessage={newMessage}
          handleSendMessage={handleSendMessage}
          setNewMessage={setNewMessage}
        />
        <div className="flex justify-center mt-8">
          <button
            className="bg-[#5A8D75] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#487760] transition-colors shadow-md"
            onClick={handleRequest}
          >
            申請する
          </button>
        </div>
      </main>
    </div>
  );
}
