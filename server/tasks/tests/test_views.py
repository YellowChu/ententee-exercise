import pytest
from django.test import Client

from tasks.models import Task

@pytest.fixture
def client():
    return Client()

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"title": "test title", "description": "test description"}, 400),
        ({"title": "test title", "description": "test description", "priority": 100}, 200),
        ({"title": "test title", "description": "test description", "priority": 999}, 400),
    ],
)
def test_task_create(data, status_code, client, db):
    response = client.post("/api/v1/tasks/", data, content_type="application/json")
    assert response.status_code == status_code


def test_task_list(db, client):
    Task.objects.create(title="A", description="AAA", priority=Task.PRIORITY_MEDIUM)
    Task.objects.create(title="B", description="BBB", priority=Task.PRIORITY_HIGH)
    Task.objects.create(title="C", description="CCC", priority=Task.PRIORITY_LOW)

    # default sort by created
    response = client.get("/api/v1/tasks/")
    assert response.json()["items"][0]["title"] == "C"

    response = client.get("/api/v1/tasks/?sort=title")
    assert response.json()["items"][0]["title"] == "A"

    response = client.get("/api/v1/tasks/?search=cCc")
    assert response.json()["items"][0]["title"] == "C"
