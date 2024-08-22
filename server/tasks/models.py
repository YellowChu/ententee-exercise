from django.db import models

class Task(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=255)
    description = models.TextField()

    PRIORITY_HIGH = 300
    PRIORITY_MEDIUM = 200
    PRIORITY_LOW = 100
    PRIORITY_CHOICES = [
        (PRIORITY_HIGH, "High"),
        (PRIORITY_MEDIUM, "Medium"),
        (PRIORITY_LOW, "Low"),
    ]
    PRIORITY_CHOICES_ARRAY = [choice[0] for choice in PRIORITY_CHOICES]

    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=PRIORITY_HIGH)

    class Meta:
        ordering = ["created"]

    def __str__(self):
        return self.title
