from django.shortcuts import render, redirect
from django.contrib import messages
from web.models import GameSession
from game.models import Deck , Card

def games(request):
    return render(request , 'game/game.html')

def select_card(request):
    name_obj , created = Card.objects.all().order_by('Name')
    