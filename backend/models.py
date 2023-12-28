from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=200)
    date_time = models.DateTimeField()
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
