import React from "react";

export default function DogInfo({ dogs }) {
  return (
    <div className="space-y-4">
      {dogs.map((dog, index) => (
        <div key={index} className="flex items-start">
          <img
            src={dog.image}
            alt={dog.name}
            className="w-24 h-24 object-cover rounded-lg shadow-md mr-4"
          />
          <div>
            <p className="text-md font-semibold text-gray-800">
              {dog.name} / {dog.breed} / {dog.age}歳 / {dog.gender}
            </p>
            <p className="text-md text-gray-600 mt-1">{dog.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
