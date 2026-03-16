import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_get_products():
    response = client.get("/products")

    assert response.status_code == 200
    assert isinstance(response.json(), list)