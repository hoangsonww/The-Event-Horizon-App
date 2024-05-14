from django.shortcuts import render
from .models import Event
from django.http import JsonResponse

def event_list():
    events = Event.objects.all().values()
    return JsonResponse(list(events), safe=False)

def event_detail(event_id):
    event = Event.objects.get(id=event_id)
    return JsonResponse({
        "name": event.name,
        "date_time": event.date_time,
        "description": event.description
    })
