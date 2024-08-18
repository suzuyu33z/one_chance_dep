"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VisitorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    bio: "",
    dog_number: 0,
    points: 0,
  });

  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]); // 犬種データを保持する状態
  const router = useRouter();

  // useEffectを使って犬種データを取得
  useEffect(() => {
    async function fetchBreeds() {
      const response = await fetch(process.env.API_ENDPOINT + `/api/breeds`);
      const breedData = await response.json();
      setBreeds(breedData);
    }

    fetchBreeds();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDogNumberChange = (e) => {
    const dogNumber = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      dog_number: dogNumber,
    });

    const newDogs = Array.from({ length: dogNumber }, () => ({
      dog_name: "",
      dog_age: "",
      dog_sex: "",
      breed_id: "",
      image: "",
      description: "",
    }));
    setDogs(newDogs);
  };

  const handleDogChange = (index, e) => {
    const newDogs = [...dogs];
    newDogs[index][e.target.name] = e.target.value;
    setDogs(newDogs);
  };

  // 統一されたファイルアップロード関数
  const handleFileChange = async (index, e, type) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (response.ok) {
        if (type === "user") {
          setFormData({ ...formData, image: result.url });
        } else if (type === "dog") {
          const newDogs = [...dogs];
          newDogs[index].image = result.url;
          setDogs(newDogs);
        }
      } else {
        console.error("画像のアップロードに失敗しました", result.error);
      }
    } catch (error) {
      console.error("画像のアップロード中にエラーが発生しました", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ユーザー情報と犬の情報を一度に送信
    const response = await fetch(process.env.API_ENDPOINT + `/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, dogs }), // ユーザー情報と犬情報を含めて送信
    });

    if (response.ok) {
      router.push("/home");
    } else {
      console.error("Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#75A05A]">
        新規登録
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">名前</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="例: 山田 太郎"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="例: example@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="6文字以上のパスワード"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            自己紹介
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="自己紹介を記入してください"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            プロフィール画像 (ファイルを選択)
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(-1, e, "user")} // ユーザー画像を設定
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            わんちゃんの数
          </label>
          <input
            type="number"
            name="dog_number"
            value={formData.dog_number}
            onChange={handleDogNumberChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            required
          />
        </div>

        {/* 動的に生成されるわんちゃん情報入力フィールド */}
        {dogs.map((dog, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              わんちゃん {index + 1} の情報
            </label>
            <input
              type="text"
              name="dog_name"
              value={dog.dog_name}
              onChange={(e) => handleDogChange(index, e)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
              placeholder="わんちゃんの名前"
              required
            />
            <input
              type="number"
              name="dog_age"
              value={dog.dog_age}
              onChange={(e) => handleDogChange(index, e)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400 mt-2"
              placeholder="わんちゃんの年齢"
              required
            />
            <select
              name="dog_sex"
              value={dog.dog_sex}
              onChange={(e) => handleDogChange(index, e)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] mt-2"
              required
            >
              <option value="">性別を選択</option>
              <option value="male">オス</option>
              <option value="female">メス</option>
            </select>
            <select
              name="breed_id"
              value={dog.breed_id}
              onChange={(e) => handleDogChange(index, e)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] mt-2"
              required
            >
              <option value="">犬種を選択</option>
              {breeds.map((breed) => (
                <option key={breed.breed_id} value={breed.breed_id}>
                  {breed.breed_name}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              value={dog.description}
              onChange={(e) => handleDogChange(index, e)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400 mt-2"
              placeholder="わんちゃんの説明"
              required
            />
            <label className="block text-gray-700 font-semibold mb-2 mt-4">
              わんちゃんの画像(ファイルを選択)
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(index, e, "dog")} // 犬の画像を設定
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400 mt-2"
              placeholder="わんちゃんの画像"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-[#A8D38D] text-white p-3 rounded-lg font-semibold hover:bg-[#96c781] transition-colors"
        >
          登録
        </button>
      </form>
    </div>
  );
}
