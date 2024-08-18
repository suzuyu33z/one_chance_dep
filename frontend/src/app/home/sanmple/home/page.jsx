import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">いろいろできますよ！</h1>
      <Link
        href="/home/walkregi"
        className="block text-blue-500 hover:text-blue-700"
      >
        さんぽを登録する
      </Link>
      <Link
        href="/home/walksearch"
        className="block text-blue-500 hover:text-blue-700"
      >
        さんぽを探す
      </Link>
      <Link
        href="/home/myschedule"
        className="block text-blue-500 hover:text-blue-700"
      >
        予定
      </Link>
      <Link
        href="/home/history"
        className="block text-blue-500 hover:text-blue-700"
      >
        りれき
      </Link>
      <Link
        href="/home/edition"
        className="block text-blue-500 hover:text-blue-700"
      >
        編集
      </Link>
      <Link href="/" className="block text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
