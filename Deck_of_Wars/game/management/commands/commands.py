from django.core.management.base import BaseCommand
from game.models import Deck 
import json
import os
from django.conf import settings

class Command(BaseCommand):
    help = "Show deck data"

    def add_arguments(self, parser):
        parser.add_argument(
            '--del',
            action='store_true',
            help='delete every data'
        )

    def handle(self , *agrs , **kwargs):
        path = os.path.join( settings.BASE_DIR ,  "game" , "data", "deck.json")
        with open(path) as f:
            deck_data = json.load(f)

        if kwargs['del']:
            Deck.objects.all().delete()


        for data in deck_data:
            name = data["name"]
            Deck.objects.update_or_create(name=name)

