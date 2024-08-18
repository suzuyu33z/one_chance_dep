import Link from "next/link";

export default function History() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">りれきです</h1>
      <Link
        href="/home/history/detail"
        className="block text-blue-500 hover:text-blue-700"
      >
        詳細を見る
      </Link>
      <Link href="/home" className="block text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
