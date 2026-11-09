import os
from typing import ClassVar

from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TIME_ZONE = "Africa/Johannesburg"
    USE_TZ = True
    LANGUAGE_CODE = "en-za"

    ALLOWED_HOSTS: ClassVar[list[str]]= [
        host.strip()
        for host in os.getenv("ALLOWED_HOSTS", "").split(",")
        if host.strip()
    ]
