from django.core.management.base import BaseCommand
from game.models import Deck , Card , Power
import json
import os
from django.conf import settings

class Command(BaseCommand):
    help = "Show deck data"

    def handle(self , *agrs , **kwargs):
        deck_path = os.path.join( settings.BASE_DIR ,  "game" , "data", "deck.json")
        ben_path = os.path.join( settings.BASE_DIR ,  "game" , "data", "Ben_10.json")
        power_path = os.path.join( settings.BASE_DIR ,  "game" , "data", "power.json")

        # for deck
        with open(deck_path) as f1 ,  open(ben_path) as f2 , open(power_path) as f3:
            deck_data = json.load(f1)
            ben_data = json.load(f2)
            power_data = json.load(f3)

        for data in deck_data:
            name = data["name"]
            Deck.objects.update_or_create(name=name)

        #for ben10
        ben_deck , _ = Deck.objects.update_or_create(name="Ben_10")

        for data in ben_data:
            Card.objects.update_or_create(
                deck=ben_deck,
                Rank=data["Rank"],
                defaults={
                    "Name": data["Name"],
                    "Power": data["Power"],
                    "Strength": data["Strength"],
                    "Speed": data["Speed"],
                    "Intelligence": data["Intelligence"],
                    "Height": data["Height"]
                }
            )


            #power card
            for data in power_data :
                name = data["name"]
                ability = data["ability"]
                Power.objects.update_or_create(name=name , ability=ability)
                