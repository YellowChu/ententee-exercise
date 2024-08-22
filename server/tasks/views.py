import json
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from tasks.models import Task

def task_serializer(task: Task):
    return {
        "id": task.pk,
        "created": task.created,
        "updated": task.updated,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
    }


def task_payload_validation(data):
    errors = {}
    if not data.get("title"):
        errors["title"] = "Title is required"
    if not data.get("description"):
        errors["description"] = "Description is required"
    if not data.get("priority"):
        errors["priority"] = "Priority is required"
    elif data["priority"] not in Task.PRIORITY_CHOICES_ARRAY:
        errors["priority"] = "Invalid priority"
    return errors


class TaskListView(View):
    def get(self, request):
        tasks = Task.objects.all()

        search_query = request.GET.get("search")
        if search_query:
            tasks = tasks.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query))

        sort_by = request.GET.get("sort")
        if sort_by == "title":
            tasks = tasks.order_by("title")
        elif sort_by == "priority":
            tasks = tasks.order_by("-priority")
        else:
            tasks = tasks.order_by("created")

        per_page = 15
        page = int(request.GET.get("page", 1))
        tasks_paginator = Paginator(tasks, per_page)
        try:
            tasks = tasks_paginator.page(page)
        except PageNotAnInteger:
            tasks = tasks_paginator.page(1)
        except EmptyPage:
            tasks = tasks_paginator.page(tasks_paginator.num_pages)

        tasks_response = [task_serializer(task) for task in tasks]
        return JsonResponse({
            "total": tasks_paginator.count,
            "num_pages": tasks_paginator.num_pages,
            "current_page": page,
            "items": tasks_response,
        }, safe=False)

    def post(self, request):
        data = json.loads(request.body)
        errors = task_payload_validation(data)
        if errors:
            return JsonResponse(errors, status=400)

        task = Task.objects.create(**data)
        return JsonResponse(task_serializer(task))


class TaskDetailView(View):
    def get(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        return JsonResponse(task_serializer(task))

    def put(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        data = json.loads(request.body)
        errors = task_payload_validation(data)
        if errors:
            return JsonResponse(errors, status=400)

        for field, value in data.items():
            setattr(task, field, value)
        task.save()
        return JsonResponse(task_serializer(task))

    def delete(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        task.delete()
        return JsonResponse({"message": "Task deleted"}, status=204)
