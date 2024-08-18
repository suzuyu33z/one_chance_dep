# uname() error回避
import platform
print("platform", platform.uname())

from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker
import json
import pandas as pd

from db_control.connect import engine
#from db_control.mymodels import Customers
from db_control.mymodels import User, Dog, Breed, Walk, Location, Request, Message, Feedback, RequestedFeedback, RequestingFeedback, WalkDogList
from datetime import datetime

#user登録するためのもの
def register_user_and_dogs(mymodel, user_values, dogs):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    # Userモデルかどうかを確認し、パスワードをハッシュ化
    if mymodel == User:
        user = User(
            name=user_values["name"],
            email=user_values["email"],
            image=user_values["image"],
            bio=user_values["bio"],
            dog_number=user_values["dog_number"],
            points=user_values["points"]
        )
        user.set_password(user_values["password"])  # パスワードをハッシュ化

        try:
            # トランザクションを開始
            with session.begin():
                session.add(user)
                session.flush()  # user_idを取得するためにフラッシュ

                # 犬の情報を登録
                for dog in dogs:
                    new_dog = Dog(
                        owner_user_id=user.user_id,
                        dog_name=dog["dog_name"],
                        dog_age=dog["dog_age"],
                        dog_sex=dog["dog_sex"],
                        breed_id=dog["breed_id"],
                        image=dog["image"],
                        description=dog["description"]
                    )
                    session.add(new_dog)

        except sqlalchemy.exc.IntegrityError:
            print("エラー: ユーザーと犬の登録に失敗しました")
            session.rollback()
            return "Failed to register user and dogs: IntegrityError"
        finally:
            # セッションを閉じる
            session.close()

        return "User and dogs registered successfully"
    else:
        # 他のモデルの場合、通常のインサートを実行
        query = insert(mymodel).values(user_values)
        try:
            # トランザクションを開始
            with session.begin():
                session.execute(query)
        except sqlalchemy.exc.IntegrityError:
            print("エラー: 登録に失敗しました")
            session.rollback()
            return "Failed to register: IntegrityError"
        finally:
            # セッションを閉じる
            session.close()

        return "Registered successfully"


#Walkを表示するためのコード
def get_all_walks():
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        walks = session.query(Walk).all()
        
        walk_data = []
        for walk in walks:
            dogs = []
            for walk_dog in walk.dogs:
                dog = walk_dog.dog
                breed = dog.breed
                dogs.append({
                    "name": dog.dog_name,
                    "breed": breed.breed_name,
                    "age": dog.dog_age,
                    "gender": dog.dog_sex,
                    "image": dog.image  # ここで画像URLを追加
                })
            
            location = walk.location

            walk_data.append({
                "walk_id": walk.walk_id,
                "date": walk.time_start.strftime("%Y/%m/%d"),
                "time_start": walk.time_start.strftime("%H:%M"),
                "time_end": walk.time_end.strftime("%H:%M"),
                "location": location.location_name,
                "dogs": dogs,
                "points_required": walk.points_required  # 必要ポイントを追加
            })
        
        return walk_data
    
    except Exception as e:
        print(f"Error fetching walks: {e}")
        return []
    
    finally:
        session.close()

#散歩詳細の取得
def get_walk_by_id(walk_id):
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        walk = session.query(Walk).filter(Walk.walk_id == walk_id).first()
        if walk:
            # 必要なデータを取得して辞書にまとめる
            dogs = []
            for walk_dog in walk.dogs:
                dog = walk_dog.dog
                breed = dog.breed
                dogs.append({
                    "name": dog.dog_name,
                    "breed": breed.breed_name,
                    "age": dog.dog_age,
                    "gender": dog.dog_sex,
                    "image": dog.image,
                    "description": dog.description,
                })
            
            location = walk.location

            walk_data = {
                "walk_id": walk.walk_id,
                "date": walk.time_start.strftime("%Y/%m/%d"),
                "time_start": walk.time_start.strftime("%H:%M"),
                "time_end": walk.time_end.strftime("%H:%M"),
                "location": location.location_name,
                "description": walk.description,
                "owner_name": walk.owner.name,
                "owner_bio": walk.owner.bio,
                "dogs": dogs,
                "points_required": walk.points_required  # 必要ポイントを追加
            }
            
            return walk_data
        else:
            return None
    
    except Exception as e:
        print(f"Error fetching walk by ID: {e}")
        return None
    
    finally:
        session.close()

#home画面で自分の予定を表示するためのもの
def get_all_walks_by_requests():
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 現在の日時を取得
        current_time = datetime.now()

        # Requestテーブルからconfirmedが1かつ未来の日時のwalk_idを取得
        requests = session.query(Request).filter(Request.confirmed == True).all()
        
        walk_data = []
        for request in requests:
            # Walkテーブルのtime_startが現在よりも未来のものを取得
            walk = session.query(Walk).filter(Walk.walk_id == request.walk_id, Walk.time_start > current_time).first()

            if walk:
                dogs = []
                for walk_dog in walk.dogs:
                    dog = walk_dog.dog
                    breed = dog.breed
                    dogs.append({
                        "name": dog.dog_name,
                        "breed": breed.breed_name,
                        "age": dog.dog_age,
                        "gender": dog.dog_sex,
                        "image": dog.image  # ここで画像URLを追加
                    })
                
                location = walk.location

                walk_data.append({
                    "walk_id": walk.walk_id,
                    "date": walk.time_start.strftime("%Y/%m/%d"),
                    "time_start": walk.time_start.strftime("%H:%M"),
                    "time_end": walk.time_end.strftime("%H:%M"),
                    "location": location.location_name,
                    "dogs": dogs,
                    "points_required": walk.points_required  # 必要ポイントを追加
                })
        
        return walk_data

    except Exception as e:
        print(f"Error fetching walks by requests: {e}")
        return []
    
    finally:
        session.close()

#walkにmessageを表示する
def get_messages_by_walk_id(walk_id):
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        messages = session.query(Message).filter(Message.walk_id == walk_id).order_by(Message.timestamp).all()
        message_data = []
        for message in messages:
            user = session.query(User).filter(User.user_id == message.sender_user_id).first()
            message_data.append({
                "message_id": message.message_id,
                "sender_user_id": message.sender_user_id,
                "sender_name": user.name,  # ユーザー名を追加
                "message": message.message,
                "timestamp": message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
        return message_data
    
    except Exception as e:
        print(f"Error fetching messages for walk ID {walk_id}: {e}")
        return []
    
    finally:
        session.close()

#walkにメッセージを追加するコード
def add_message_to_walk(walk_id, sender_user_id, message_text):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        new_message = Message(
            walk_id=walk_id,
            sender_user_id=sender_user_id,
            message=message_text
        )
        session.add(new_message)
        session.commit()

        # メッセージとユーザー情報を返す
        result = {
            "message_id": new_message.message_id,
            "walk_id": walk_id,
            "message": message_text,
            "sender_user_id": sender_user_id,
            "sender_name": session.query(User).filter(User.user_id == sender_user_id).first().name,
            "timestamp": new_message.timestamp
        }
        return result

    except Exception as e:
        session.rollback()
        print(f"Error adding message: {e}")
        return None
    
    finally:
        session.close()

#walkに対してrequestを送信するコード
def create_walk_request(walk_id, requesting_user_id, requested_time):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        walk = session.query(Walk).filter(Walk.walk_id == walk_id).first()
        if not walk:
            return False

        # requestテーブルに挿入
        new_request = Request(
            walk_id=walk_id,
            requested_user_id=walk.owner_user_id,
            requesting_user_id=requesting_user_id,
            requested_time=requested_time,  # ここで正しくdatetimeを使用
            confirmed=False,  # 初期値はFalse
            timestamp=datetime.now(),  # 現在時刻
            points_paid=0  # 必要ならば適切に設定
        )
        session.add(new_request)
        session.commit()  # 新しいリクエストをコミット

        # requested_feedbackテーブルに挿入
        new_requested_feedback = RequestedFeedback(
            content="",
            rating=0,
            timestamp=datetime.now()  # フィードバックの作成日時
        )
        session.add(new_requested_feedback)
        session.commit()  # フィードバックをコミットしてIDを取得

        # requesting_feedbackテーブルに挿入
        new_requesting_feedback = RequestingFeedback(
            content="",
            rating=0,
            timestamp=datetime.now()  # フィードバックの作成日時
        )
        session.add(new_requesting_feedback)
        session.commit()  # フィードバックをコミットしてIDを取得

        # Feedbackテーブルに挿入
        new_feedback = Feedback(
            walk_id=walk_id,
            requested_user_id=walk.owner_user_id,
            requesting_user_id=requesting_user_id,
            requested_feedback_id=new_requested_feedback.requested_feedback_id,
            requesting_feedback_id=new_requesting_feedback.requesting_feedback_id
        )
        session.add(new_feedback)

        session.commit()
        return True

    except Exception as e:
        session.rollback()
        print(f"Error creating request: {e}")
        return False

    finally:
        session.close()

#犬登録時のBreedテーブル呼び出し
def get_all_breeds():
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        breeds = session.query(Breed).all()
        breed_list = [{"breed_id": breed.breed_id, "breed_name": breed.breed_name} for breed in breeds]
        return breed_list
    except Exception as e:
        print(f"Error fetching breeds: {e}")
        return []
    finally:
        session.close()

# 犬情報登録用の関数
def register_dogs(user_id, dogs):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        for dog in dogs:
            new_dog = Dog(
                owner_user_id=user_id,
                dog_name=dog["dog_name"],
                dog_age=dog["dog_age"],
                dog_sex=dog["dog_sex"],
                breed_id=dog["breed_id"],
                image=dog["image"],
                description=dog["description"]
            )
            session.add(new_dog)
        session.commit()
        return True
    except Exception as e:
        session.rollback()
        print(f"Error registering dogs: {e}")  # エラーメッセージをログに出力
        return str(e)  # エラーをクライアントに返す
    finally:
        session.close()

#散歩の登録
def register_walk(walk_values, dog_ids):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        new_walk = Walk(
            owner_user_id=walk_values["owner_user_id"],
            description=walk_values["description"],
            time_start=walk_values["time_start"],
            time_end=walk_values["time_end"],
            location_id=walk_values["location_id"],
            points_required=walk_values["points_required"]
        )

        session.add(new_walk)
        session.flush()  # walk_idを取得するためにフラッシュ

        # WalkDogListに犬を追加
        for dog_id in dog_ids:
            walk_dog = WalkDogList(
                walk_id=new_walk.walk_id,
                dog_id=dog_id
            )
            session.add(walk_dog)

        session.commit()
        return "Walk and dogs registered successfully"
    except Exception as e:
        session.rollback()
        print(f"Error registering walk and dogs: {e}")
        return str(e)
    finally:
        session.close()

#location取得の関数
def get_all_locations():
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        locations = session.query(Location).all()
        location_list = [{"location_id": loc.location_id, "location_name": loc.location_name, "description": loc.description} for loc in locations]
        return location_list
    except Exception as e:
        print(f"Error fetching locations: {e}")
        return []
    finally:
        session.close()

#ユーザーの犬リスト取得
def get_dogs_by_user(user_id):
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        dogs = session.query(Dog).filter(Dog.owner_user_id == user_id).all()
        dog_list = [{"dog_id": dog.dog_id, "dog_name": dog.dog_name, "breed_id": dog.breed_id, "dog_age": dog.dog_age, "dog_sex": dog.dog_sex, "description": dog.description} for dog in dogs]
        return dog_list
    except Exception as e:
        print(f"Error fetching dogs for user {user_id}: {e}")
        return []
    finally:
        session.close()
