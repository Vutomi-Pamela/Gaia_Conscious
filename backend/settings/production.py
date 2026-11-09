import os

from .base import BaseConfig


class ProductionConfig(BaseConfig):
    DEBUG = False
    ENVIRONMENT = "production"

    @classmethod
    def validate(cls):
        required_variables = {
            "SECRET_KEY": os.getenv("SECRET_KEY"),
            "DATABASE_URL": os.getenv("DATABASE_URL"),
            "MINIO_ROOT_USER": os.getenv("MINIO_ROOT_USER"),
            "MINIO_ROOT_PASSWORD": os.getenv("MINIO_ROOT_PASSWORD"),
            "ALLOWED_HOSTS": os.getenv("ALLOWED_HOSTS"),
        }

        missing = [
            name
            for name, value in required_variables.items()
            if not value or not value.strip()
        ]

        if missing:
            raise RuntimeError(
                "Production configuration error. "
                "Missing environment variables: "
                + ", ".join(missing)
            )

        debug_value = os.getenv("DEBUG", "false").strip().lower()

        if cls.DEBUG or debug_value in {"1", "true", "yes", "on"}:
            raise RuntimeError(
                "Security error: Production cannot run with DEBUG enabled."
            )