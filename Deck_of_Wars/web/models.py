from django.db import models
from django.contrib.auth.models import User

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

    
