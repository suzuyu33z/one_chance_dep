import Link from "next/link";

export default function MyScheduleDetail() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">自分のスケジュールの詳細</h1>
      <Link
        href="/home/myschedule"
        className="block text-blue-500 hover:text-blue-700"
      >
        戻る
      </Link>
    </div>
  );
}
