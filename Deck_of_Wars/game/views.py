from django.shortcuts import render, redirect
from django.conf import settings
from web.models import GameSession 
from django.contrib import messages
from django.core.cache import cache
import os
import json
import random

class GameState:
    def __init__(self , code):
        self.card_set = []
        self.power_set = []
        self.gamesession = GameSession.objects.get(code=code)
        self.load_json_data()
        self.random_power = 0 
        self.deck_selection()

    def load_json_data(self):
        power_path = os.path.join("game" , "data", "power.json")
        ben_path = os.path.join("game" , "data", "Ben_10.json")

        with open(power_path) as f1 , open(ben_path) as f2:
            self.power_data = json.load(f1)
            self.ben_data = json.load(f2)

    def deck_selection(self):
        self.power_set = (self.power_data).copy()
        deck_name:str = self.gamesession.mode
        if deck_name == "Ben_10" :
            self.card_set = (self.ben_data).copy()
        elif deck_name == "Marvel":
            pass
        elif deck_name == "DC":
            pass
        else:
            messages.error(f'select a valid mode ')

    def power_distribution(self):
        random.shuffle(self.power_set)
        # random.seed(0)
        hand1 = self.power_set[:self.random_power]
        self.power_set = self.power_set[self.random_power:]
        return hand1

    def card_distribution(self):
        random.shuffle(self.card_set)
        # random.seed(0)
        normal = (10)-(self.random_power)
        print(self.random_power)
        hand2 = self.card_set[:normal]
        self.card_set = self.card_set[normal:]
        return hand2
                

    def game_state(self):
        game_state = {
            "code" : self.gamesession.code ,
            "mode" : self.gamesession.mode ,
            "players" : {} ,
            "remaining_deck": self.card_set,
        }

        players_joined = self.gamesession.get_players()
        
        for index , players in enumerate(players_joined):
            if players != players_joined[-1]:
                self.random_power = random.randint(0 , len(self.power_set))    
            else :
                self.random_power = len(self.power_set)
            game_state["players"][players] = {
                "id" : index+1 ,  
                "hand1" : self.power_distribution(),
                "hand2" : self.card_distribution() 
            }
            
        return game_state


def games(request):
    code = request.GET.get('code')
    gs = GameState(code)
    state = gs.game_state()

    cache.set(f"GAME : {code}" , json.dumps(state) , timeout=3600)
    state_json = cache.get(f"GAME : {code}")
    context = {"title" : "GAME"}

    if state_json:
        context["game_state"]=json.loads(state_json)

    return render(request , 'game/game.html' , context)
