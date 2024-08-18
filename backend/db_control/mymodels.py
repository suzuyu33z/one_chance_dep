from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Text, DateTime, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from .auth import set_password, check_password

# ベースクラスの定義
class Base(DeclarativeBase):
    pass

# Userテーブル
class User(Base):
    __tablename__ = 'user'
    user_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column()
    image: Mapped[str] = mapped_column()
    dog_number: Mapped[int] = mapped_column()
    bio: Mapped[str] = mapped_column(Text)
    points: Mapped[int] = mapped_column()

    # リレーションシップ
    dogs = relationship("Dog", back_populates="owner")
    walks = relationship("Walk", back_populates="owner")
    requests = relationship("Request", back_populates="requested_user", foreign_keys="[Request.requested_user_id]")
    messages = relationship("Message", back_populates="sender")


    def set_password(self, password):
        self.password = set_password(password)

    def check_password(self, password):
        return check_password(self.password, password)

# Dogテーブル
class Dog(Base):
    __tablename__ = 'dog'
    dog_id: Mapped[int] = mapped_column(primary_key=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    image: Mapped[str] = mapped_column()
    dog_name: Mapped[str] = mapped_column()
    breed_id: Mapped[int] = mapped_column(ForeignKey('breed.breed_id'))
    dog_age: Mapped[int] = mapped_column()
    dog_sex: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column(Text)

    # リレーションシップ
    owner = relationship("User", back_populates="dogs")
    breed = relationship("Breed", back_populates="dogs")
    walks = relationship("WalkDogList", back_populates="dog")

# Breedテーブル
class Breed(Base):
    __tablename__ = 'breed'
    breed_id: Mapped[int] = mapped_column(primary_key=True)
    breed_name: Mapped[str] = mapped_column()
    size: Mapped[str] = mapped_column()

    # リレーションシップ
    dogs = relationship("Dog", back_populates="breed")

# Walkテーブル
class Walk(Base):
    __tablename__ = 'walk'
    walk_id: Mapped[int] = mapped_column(primary_key=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    description: Mapped[str] = mapped_column(Text)
    time_start: Mapped[datetime] = mapped_column(DateTime)
    time_end: Mapped[datetime] = mapped_column(DateTime)
    location_id: Mapped[int] = mapped_column(ForeignKey('location.location_id'))
    points_required: Mapped[int] = mapped_column()
    feedbacks = relationship("Feedback", back_populates="walk") 

    # リレーションシップ
    owner = relationship("User", back_populates="walks")
    location = relationship("Location", back_populates="walks")
    requests = relationship("Request", back_populates="walk")
    dogs = relationship("WalkDogList", back_populates="walk")
    messages = relationship("Message", back_populates="walk")

# Locationテーブル
class Location(Base):
    __tablename__ = 'location'
    location_id: Mapped[int] = mapped_column(primary_key=True)
    location_name: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column(Text)

    # リレーションシップ
    walks = relationship("Walk", back_populates="location")

# Requestテーブル
class Request(Base):
    __tablename__ = 'request'
    request_id: Mapped[int] = mapped_column(primary_key=True)
    walk_id: Mapped[int] = mapped_column(ForeignKey('walk.walk_id'))
    requested_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    requesting_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    requested_time: Mapped[datetime] = mapped_column(DateTime)
    confirmed: Mapped[bool] = mapped_column(Boolean)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    points_paid: Mapped[int] = mapped_column()

    # リレーションシップ
    walk = relationship("Walk", back_populates="requests")
    requested_user = relationship("User", foreign_keys=[requested_user_id], back_populates="requests")
    requesting_user = relationship("User", foreign_keys=[requesting_user_id])

# Messageテーブル
class Message(Base):
    __tablename__ = 'message'
    message_id: Mapped[int] = mapped_column(primary_key=True)
    walk_id: Mapped[int] = mapped_column(ForeignKey('walk.walk_id'))
    sender_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    message: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    # リレーションシップ
    walk = relationship("Walk", back_populates="messages")
    sender = relationship("User", back_populates="messages")

# Feedbackテーブル
class Feedback(Base):
    __tablename__ = 'feedback'
    feedback_id: Mapped[int] = mapped_column(primary_key=True)
    walk_id: Mapped[int] = mapped_column(ForeignKey('walk.walk_id'))
    requested_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    requesting_user_id: Mapped[int] = mapped_column(ForeignKey('user.user_id'))
    requested_feedback_id: Mapped[int] = mapped_column(ForeignKey('requested_feedback.requested_feedback_id'))
    requesting_feedback_id: Mapped[int] = mapped_column(ForeignKey('requesting_feedback.requesting_feedback_id'))

    # リレーションシップ
    walk = relationship("Walk", back_populates="feedbacks")
    walk = relationship("Walk", back_populates="feedbacks")
    requested_feedback = relationship("RequestedFeedback", back_populates="feedback")
    requesting_feedback = relationship("RequestingFeedback", back_populates="feedback")
    requested_user = relationship("User", foreign_keys=[requested_user_id])
    requesting_user = relationship("User", foreign_keys=[requesting_user_id])


# RequestedFeedbackテーブル
class RequestedFeedback(Base):
    __tablename__ = 'requested_feedback'
    requested_feedback_id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    rating: Mapped[int] = mapped_column()
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    # リレーションシップ
    feedback = relationship("Feedback", back_populates="requested_feedback")

# RequestingFeedbackテーブル
class RequestingFeedback(Base):
    __tablename__ = 'requesting_feedback'
    requesting_feedback_id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    rating: Mapped[int] = mapped_column()
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    # リレーションシップ
    feedback = relationship("Feedback", back_populates="requesting_feedback")

# WalkDogListテーブル（中間テーブル）
class WalkDogList(Base):
    __tablename__ = 'walk_dog_list'
    walk_dog_id: Mapped[int] = mapped_column(primary_key=True)
    walk_id: Mapped[int] = mapped_column(ForeignKey('walk.walk_id'))
    dog_id: Mapped[int] = mapped_column(ForeignKey('dog.dog_id'))

    # リレーションシップ
    walk = relationship("Walk", back_populates="dogs")
    dog = relationship("Dog", back_populates="walks")
