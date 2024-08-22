from django.urls import re_path

from tasks.views import TaskListView, TaskDetailView

url_patterns = [
    re_path(r"^tasks/$", TaskListView.as_view(), name="task-list"),
    re_path(r"^tasks/(?P<task_id>\d+)/$", TaskDetailView.as_view(), name="task-detail"),
]
