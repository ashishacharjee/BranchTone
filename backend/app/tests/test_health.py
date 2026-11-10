"""Health and root endpoint tests."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_ok() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "branchtone-backend"
    assert data["version"] == "0.1.0"
    assert "timestamp" in data
    assert "compliance_note" in data


def test_root_ok() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
