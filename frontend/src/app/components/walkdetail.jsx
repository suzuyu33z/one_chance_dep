import React from "react";

export default function WalkDetail({ date, time_start, time_end, location, description }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">日時</p>
          <p className="text-lg font-semibold text-gray-800">
            {date} {time_start}〜{time_end}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">場所</p>
          <p className="text-lg font-semibold text-gray-800">{location}</p>
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm">散歩について</p>
        <p className="text-lg text-gray-800 mt-1">{description}</p>
      </div>
    </div>
  );
}
