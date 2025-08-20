from django.shortcuts import render, redirect
from django.contrib import messages
from web.models import GameSession
from game.models import Deck , Card , Players_in_game

def games(request):
    
    return render(request , 'game/game.html')
