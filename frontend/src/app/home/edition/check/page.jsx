import Link from "next/link";

export default function EditionCheck() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール編集の確認画面</h1>
      <Link href="/home/edition" className="text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
