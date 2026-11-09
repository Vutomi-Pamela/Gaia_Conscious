import os

from .development import DevelopmentConfig
from .production import ProductionConfig
from .testing import TestingConfig

configurations = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config():
    environment = os.getenv("APP_ENV", "development")

    if environment not in configurations:
        raise RuntimeError(f"Unknown application environment: {environment}")

    return configurations[environment]
