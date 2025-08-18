from django.db import models
import random
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

# class Game(models.Model):
#     select_card = models.ForeignKey(Card , choices='Name')
#     card_to_player1 = models.TextField(default='[]')
#     card_to_player2 = models.TextField(default='[]')
#     card_to_player3 = models.TextField(default='[]')
#     card_to_player4 = models.TextField(default='[]')

#     def card_distribution(self , request):
#         if request.method == 'POST':
#             Game_Obj = GameSession(request.POST)
#             Number_of_players = Game_Obj.num_players

#             if Number_of_players == 2:
#                 for _ in range(10):
#                     self.card_to_player1(random.choice())