from flask import Flask, request
from flask import jsonify, session
import json
from flask_cors import CORS
import datetime  # datetimeをインポート
from db_control import crud, mymodels
from datetime import datetime, timedelta
import requests

from werkzeug.security import check_password_hash
from sqlalchemy.orm import Session
from db_control.connect import engine
# Azure Database for MySQL
# REST APIでありCRUDを持っている
app = Flask(__name__)
app.secret_key = 'your_secret_key'
# セッションに関する設定です

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,  # HTTPS を使用する場合
    SESSION_COOKIE_SAMESITE="None",  # クロスサイトでのクッキー送信を許可
    SESSION_COOKIE_DOMAIN=None,  # 自動設定
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=30),
    SESSION_TYPE='filesystem'
)

CORS(app, supports_credentials=True, origins=["*"])


@app.route("/")
def index():
    return "<p>Flask top page!</p>"

#新規登録時のコード（visitor）
@app.route("/api/register", methods=["POST"])
def register_user_and_dogs():
    data = request.get_json()
    print("Received form data:", data)

    user_values = {
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "image": data.get("image"),
        "bio": data.get("bio"),
        "dog_number": data.get("dog_number", 0),
        "points": data.get("points", 0)
    }

    # 犬の情報を取得
    dogs = data.get("dogs", [])

    # ユーザーと犬の登録を一括して処理する
    result = crud.register_user_and_dogs(mymodels.User, user_values, dogs)

    if result == "User and dogs registered successfully":
        return jsonify({"message": result}), 200
    else:
        return jsonify({"error": result}), 500


#ログイン時のコード
@app.route("/api/login", methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    with Session(engine) as db_session:
        user = db_session.query(mymodels.User).filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.user_id  # セッションに user_id を保存
            print("Session after login:", session)  # セッションデータをログに出力
            return jsonify({'message': 'Logged in successfully'}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401


# 認証状態をチェックするエンドポイント
@app.route("/api/check-auth", methods=['GET'])
def check_auth():
    print("Session data:", session)  # セッションデータをログに出力
    if 'user_id' in session:
        return jsonify({'message': 'Authenticated', 'user_id': session['user_id']}), 200
    else:
        return jsonify({'error': 'Unauthorized'}), 401


#ログアウトするためのエンドポイント
@app.route("/api/logout", methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200


#散歩情報取得のコード
@app.route("/api/walks", methods=["GET"])
def get_walks():
    walk_data = crud.get_all_walks()  # crud.pyの関数を呼び出し
    return jsonify(walk_data)

#散歩詳細の取得
@app.route("/api/walks/<int:walk_id>", methods=["GET"])
def get_walk_detail(walk_id):
    walk = crud.get_walk_by_id(walk_id)
    if walk:
        return jsonify(walk)
    else:
        return jsonify({"error": "Walk not found"}), 404

#home画面で自分の予定を取得するためのもの
@app.route("/api/all_user_walks", methods=["GET"])
def get_all_user_walks():
    walk_data = crud.get_all_walks_by_requests()
    return jsonify(walk_data)

#walkのmessageを表示する
@app.route("/api/walks/<int:walk_id>/messages", methods=["GET"])
def get_walk_messages(walk_id):
    messages = crud.get_messages_by_walk_id(walk_id)
    if messages:
        return jsonify(messages), 200
    else:
        return jsonify({"error": "No messages found for this walk"}), 404

# メッセージの投稿（新しいエンドポイント）
@app.route("/api/walks/<int:walk_id>/messages", methods=["POST"])
def post_walk_message(walk_id):
    data = request.get_json()
    if not data or "message" not in data or "sender_user_id" not in data:
        return jsonify({"error": "Invalid data"}), 400

    result = crud.add_message_to_walk(walk_id, data["sender_user_id"], data["message"])
    if result:
        return jsonify(result), 201
    else:
        return jsonify({"error": "Failed to add message"}), 500

#walkに対してrequestを行うコード
@app.route("/api/request_walk", methods=["POST"])
def request_walk():
    data = request.get_json()
    requesting_user_id = session.get('user_id')
    if not requesting_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    walk_id = data.get("walk_id")
    requested_time_str = data.get("requested_time")  # クライアントからの文字列を取得

    # リクエストされた散歩の情報を取得
    walk = crud.get_walk_by_id(walk_id)
    if not walk:
        return jsonify({"error": "Walk not found"}), 404
    
    required_points = walk["points_required"]

    try:
        # requested_time_str のフォーマットを調整して datetime オブジェクトに変換
        if len(requested_time_str) == 5:  # フォーマットが 'HH:MM' の場合
            today = datetime.now().date()  # 今日の日付を取得
            requested_time = datetime.combine(today, datetime.strptime(requested_time_str, '%H:%M').time())
        else:
            requested_time = datetime.strptime(requested_time_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    # ユーザーのポイントを取得
    with Session(engine) as db_session:
        user = db_session.query(mymodels.User).filter_by(user_id=requesting_user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # ポイントが足りるかチェック
        if user.points < required_points:
            return jsonify({"error": "Not enough points"}), 400

        # ポイントを引く
        user.points -= required_points

        # リクエストを作成
        result = crud.create_walk_request(
            walk_id=walk_id,
            requesting_user_id=requesting_user_id,
            requested_time=requested_time
        )

        if result:
            db_session.commit()  # トランザクションをコミット
            return jsonify({"message": "Request created successfully"}), 201
        else:
            db_session.rollback()  # エラー時にロールバック
            return jsonify({"error": "Failed to create request"}), 500


# 犬の情報を登録するコード
@app.route("/api/register-dogs", methods=["POST"])
def register_dogs():
    data = request.get_json()
    user_id = data.get("user_id")
    dogs = data.get("dogs")

    if not user_id or not dogs:
        return jsonify({"error": "Invalid data"}), 400

    result = crud.register_dogs(user_id, dogs)

    if result:
        return jsonify({"message": "Dogs registered successfully"}), 200
    else:
        return jsonify({"error": "Failed to register dogs"}), 500

#わんちゃん登録時の犬種選択
@app.route("/api/breeds", methods=["GET"])
def get_breeds():
    breed_list = crud.get_all_breeds()  # crud.pyの関数を呼び出す
    return jsonify(breed_list)

# 散歩の登録
@app.route("/api/register-walk", methods=["POST"])
def register_walk():
    user_id = session.get("user_id")  # ログイン中のユーザーのIDを取得
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        # time_start と time_end を datetime オブジェクトに変換
        time_start = datetime.fromisoformat(data.get("time_start"))
        time_end = datetime.fromisoformat(data.get("time_end"))
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    walk_values = {
        "owner_user_id": user_id,
        "description": data.get("description"),
        "time_start": time_start,
        "time_end": time_end,
        "location_id": data.get("location_id"),
        "points_required": data.get("points_required", 0)  # リクエストからポイントを取得
    }

    dogs = data.get("dogs", [])

    result = crud.register_walk(walk_values, dogs)
    if result == "Walk and dogs registered successfully":
        return jsonify({"message": result}), 200
    else:
        return jsonify({"error": result}), 500

#locationを取得
@app.route("/api/locations", methods=["GET"])
def get_locations():
    locations = crud.get_all_locations()
    if locations:
        return jsonify(locations), 200
    else:
        return jsonify({"error": "No locations found"}), 404

#現在ログインしているユーザーの犬リストを取得
@app.route("/api/user-dogs", methods=["GET"])
def get_user_dogs():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    dogs = crud.get_dogs_by_user(user_id)
    if dogs:
        return jsonify(dogs), 200
    else:
        return jsonify({"error": "No dogs found for this user"}), 404

#散歩登録の権限ないユーザーに返す画面
@app.route("/api/user-info", methods=["GET"])
def get_user_info():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    with Session(engine) as db_session:
        user = db_session.query(mymodels.User).filter_by(user_id=user_id).first()
        if user:
            user_info = {
                "name": user.name,
                "email": user.email,
                "dog_number": user.dog_number,
                "points": user.points
            }
            return jsonify(user_info), 200
        else:
            return jsonify({"error": "User not found"}), 404
