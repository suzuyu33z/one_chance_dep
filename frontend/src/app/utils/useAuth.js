// src/utils/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "./auth";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth().then((data) => {
      if (data.error) {
        router.push("/login"); // ログインしていない場合はログインページにリダイレクト
      } else {
        setIsAuthenticated(true); // ログイン状態を保存
      }
    });
  }, [router]);

  return isAuthenticated;
}
