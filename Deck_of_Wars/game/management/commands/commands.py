from django.core.management.base import BaseCommand
from game.models import Deck , Card
import json
import os
from django.conf import settings

class Command(BaseCommand):
    help = "Show deck data"

    def handle(self , *agrs , **kwargs):
        deck_path = os.path.join( settings.BASE_DIR ,  "game" , "data", "deck.json")
        ben_path = os.path.join( settings.BASE_DIR ,  "game" , "data", "Ben_102.json")

        # for deck
        with open(deck_path) as f:
            deck_data = json.load(f)

        for data in deck_data:
            name = data["name"]
            Deck.objects.update_or_create(name=name)

        #for ben10
        with open(ben_path) as f:
            ben_data = json.load(f)

        ben_deck , _ = Deck.objects.update_or_create(name="Ben 10")

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

