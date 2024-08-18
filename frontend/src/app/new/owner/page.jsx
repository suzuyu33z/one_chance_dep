import Link from "next/link";

export default function NewOwner() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        オーナーさん、しっかり入力してね！
      </h1>
      <Link
        href="/new/owner/check"
        className="block text-blue-500 hover:text-blue-700"
      >
        確認へ進む
      </Link>
      <Link href="/new" className="block text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
