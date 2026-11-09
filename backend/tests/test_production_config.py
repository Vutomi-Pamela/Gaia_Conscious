import os
import unittest
from unittest.mock import patch

from settings.production import ProductionConfig


class ProductionConfigTests(unittest.TestCase):

    def test_missing_secret_key_fails(self):
        test_environment = {
            "SECRET_KEY": "",
            "DATABASE_URL": "postgresql://test:test@localhost:5432/test",
            "MINIO_ROOT_USER": "testuser",
            "MINIO_ROOT_PASSWORD": "testpassword",
            "ALLOWED_HOSTS": "localhost",
        }

        with patch.dict(os.environ, test_environment, clear=True):
            with self.assertRaisesRegex(RuntimeError, "SECRET_KEY"):
                ProductionConfig.validate()

    def test_debug_enabled_fails(self):
        test_environment = {
            "SECRET_KEY": "test-secret",
            "DATABASE_URL": "postgresql://test:test@localhost:5432/test",
            "MINIO_ROOT_USER": "testuser",
            "MINIO_ROOT_PASSWORD": "testpassword",
            "ALLOWED_HOSTS": "localhost",
            "DEBUG": "true",
        }

        with patch.dict(os.environ, test_environment, clear=True):
            with self.assertRaisesRegex(RuntimeError, "DEBUG"):
                ProductionConfig.validate()


if __name__ == "__main__":
    unittest.main()