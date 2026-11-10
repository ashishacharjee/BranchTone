"""Error envelope and exception handling tests."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_not_found_returns_standard_error_envelope() -> None:
    response = client.get("/api/v1/nonexistent_resource")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "NOT_FOUND"
    assert data["error"]["message"] == "The requested resource was not found."


def test_root_not_found_returns_standard_error_envelope() -> None:
    response = client.get("/random_path")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "NOT_FOUND"
