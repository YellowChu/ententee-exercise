from django.contrib import admin
from django.urls import path, include

from tasks.urls import url_patterns as tasks_url_patterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(tasks_url_patterns)),
]
