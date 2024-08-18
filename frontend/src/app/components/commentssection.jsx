import React from "react";

export default function CommentsSection({
  messages,
  userId,
  newMessage,
  handleSendMessage,
  setNewMessage,
}) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">コメント</h2>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md ${
                message.sender_user_id === userId ? "bg-[#E6F7E6]" : "bg-white"
              }`}
            >
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  {message.sender_name}
                </p>
                <p className="text-xs text-gray-500">{message.timestamp}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">{message.message}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">コメントがありません。</p>
        )}
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
          placeholder="ここにコメントを入力..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-[#A8D38D] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#96c781] transition-colors shadow-md"
          onClick={handleSendMessage}
        >
          送信
        </button>
      </div>
    </div>
  );
}

