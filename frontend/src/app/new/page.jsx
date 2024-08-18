import Link from "next/link";

export default function New() {
  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-8 text-center text-[#A8D38D]">
        さあ、始めましょう
      </h1>
      <div className="grid gap-6">
        <Link href="/new/owner">
          <div className="w-full bg-[#A8D38D] text-white py-4 rounded-lg font-semibold text-center hover:bg-[#96c781] transition-colors cursor-pointer shadow-md">
            私のわんちゃんをみんなに紹介
          </div>
        </Link>
        <Link href="/new/visitor">
          <div className="w-full bg-[#A8D38D] text-white py-4 rounded-lg font-semibold text-center hover:bg-[#96c781] transition-colors cursor-pointer shadow-md">
            わんちゃんたちと触れ合いたい
          </div>
        </Link>
        <Link href="/">
          <div className="w-full bg-gray-300 text-gray-700 py-4 rounded-lg font-semibold text-center hover:bg-gray-400 transition-colors cursor-pointer shadow-md">
            戻る
          </div>
        </Link>
      </div>
    </div>
  );
}

