import React from "react";

export default function OwnerInfo({ ownerName, ownerBio }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <p className="text-gray-500 text-sm">オーナー情報</p>
      <p className="text-lg font-semibold text-gray-800 mt-1">名前: {ownerName}</p>
      <p className="text-md text-gray-800 mt-1">自己紹介: {ownerBio}</p>
    </div>
  );
}
