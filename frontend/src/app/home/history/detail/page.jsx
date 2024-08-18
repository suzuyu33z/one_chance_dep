import Link from "next/link";

export default function HistoryDetail() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">りれき詳細です</h1>
      <Link
        href="/home/history/detail/feedback"
        className="block text-blue-500 hover:text-blue-700"
      >
        フィードバックをする・見る
      </Link>
      <Link
        href="/home/history"
        className="block text-blue-500 hover:text-blue-700"
      >
        戻る
      </Link>
    </div>
  );
}
