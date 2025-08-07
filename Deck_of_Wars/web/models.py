from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import json

class Player(models.Model):
    # user = models.OneToOneField(User , on_delete=models.CASCADE)
    Name  = models.CharField(User , max_length=20 , blank=True)
    photo = models.ImageField(blank=True , default='pfp.jpg')
    Rank = models.CharField(max_length=20 , default='NOOB')
    No_of_matches_played = models.IntegerField(default=0)
    No_of_matches_won = models.IntegerField(default=0)
    winning_streak = models.IntegerField(default=0)
    No_of_achievements = models.IntegerField(default=0)

    def __str__(self):
        return self.Name + ' ' + '(' + self.Rank + ')'    
    
    def matches_update(self):
        pass

    def Winning_Streak_update(self):
        pass

    def No_of_matches_won_update(self):
        pass

    
class GameSession(models.Model):
    name = models.ForeignKey(User , on_delete=models.CASCADE)
    code = models.CharField(blank=False , max_length=8 , unique=True , primary_key=True)
    mode = models.CharField(max_length=10 , blank=False )   
    num_players = models.IntegerField()
    Player_joined = models.TextField(default='[]')
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return self.name + ' ' + self.code
    
    def add_player(self , username):
        data = json.loads(self.Player_joined)
        if username in data and len(self.Player_joined) < self.num_players:
            data.append(username)
            self.save()
            return True
        return False
    
    def get_players(self):
        return json.loads(self.Player_joined)
    
    def if_full(self , request):
        if len(self.Player_joined) == self.num_players:
            return render(request , 'pass')
    


