from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import json

class Player(models.Model):
    Name  = models.ForeignKey(User , on_delete=models.CASCADE)
    photo = models.ImageField(blank=True , default='assets/pfp.png')
    Rank = models.CharField(max_length=20 , default='NOOB')
    No_of_matches_played = models.IntegerField(default=0)
    No_of_matches_won = models.IntegerField(default=0)
    winning_streak = models.IntegerField(default=0)
    No_of_achievements = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.Name}'
    
    def __unicode__(self):
        return self.id()
    
class GameSession(models.Model):
    name = models.ForeignKey(User , on_delete=models.CASCADE)
    code = models.CharField(blank=False , max_length=8 , unique=True , primary_key=True)
    mode = models.CharField(max_length=10 , blank=False )   
    num_players = models.IntegerField()
    Player_joined = models.TextField(default='[]')
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.name.username} - {self.code}"
    
    def add_player(self , username):
        data = json.loads(self.Player_joined)
        if username not in data and len(data) < self.num_players:
            data.append(username)
            self.Player_joined = json.dumps(data)
            self.save()
            return True
        return False
    
    def get_players(self):
        player_data = json.loads(self.Player_joined)
        return player_data
    
    def is_full(self):
        if len(self.get_players()) >= self.num_players:
            return True
        else :
            return False


