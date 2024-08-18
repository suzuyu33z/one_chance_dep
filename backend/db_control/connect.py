# uname() error回避
import platform
print(platform.uname())

from sqlalchemy import create_engine
import sqlalchemy

import os
main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)
print(f"Changed directory to: {main_path}")

# 接続プールのサイズを増やすためのパラメータを追加
engine = create_engine(
    "sqlite:///WANONWAN.db",
    echo=True,
    pool_size=10,        # プールサイズの設定（例えば10に設定）
    max_overflow=20,     # プール外で作成可能な追加接続数の設定（例えば20に設定）
    pool_timeout=30,     # プールから接続を取得するまでのタイムアウト時間（秒）
    pool_recycle=1800    # 接続のリサイクル時間（秒）
)

print("Database engine created:", engine)
