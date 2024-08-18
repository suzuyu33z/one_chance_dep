import Link from "next/link";

export default function Edition() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>
      <Link
        href="/home/edition/check"
        className="block text-blue-500 hover:text-blue-700"
      >
        確認画面へ
      </Link>
      <Link href="/home" className="block text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
