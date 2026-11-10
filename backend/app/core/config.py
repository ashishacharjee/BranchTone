"""Application configuration loaded from environment variables."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str = "sqlite:///./branchtone.db"

    # Storage
    storage_root: str = "./storage"

    # Upload limits
    max_upload_mb: int = 50

    # CORS
    cors_origins: list[str] = ["http://localhost:5173"]

    # API version
    api_version: str = "v1"

    # Gemini API key — intentionally unused until compliance gate clears
    gemini_api_key: str = ""


settings = Settings()
