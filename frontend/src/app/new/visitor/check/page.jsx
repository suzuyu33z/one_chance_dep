import Link from "next/link";

export default function NewVisitorCheck() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        ビジターさん、これでいいですか？
      </h1>
      <Link
        href="/new/visitor"
        className="block text-blue-500 hover:text-blue-700"
      >
        戻る
      </Link>
    </div>
  );
}
