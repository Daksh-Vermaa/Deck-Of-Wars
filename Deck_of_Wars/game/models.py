from django.db import models
import random
import json
import os
from django.conf import settings
from web.models import GameSession , Player

class Deck(models.Model):
    name = models.CharField(max_length=50, unique=True , default="null")

    def __str__(self):
        return f"{self.name}"

class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    Name = models.CharField(max_length=200)
    Rank = models.IntegerField()
    Power = models.IntegerField()
    Strength = models.IntegerField()
    Speed = models.IntegerField()
    Intelligence = models.IntegerField()
    Height = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.Name} - {self.Rank}"

    class Meta:
        ordering = ['deck' , 'Rank']
        unique_together = ['deck' , 'Rank']

