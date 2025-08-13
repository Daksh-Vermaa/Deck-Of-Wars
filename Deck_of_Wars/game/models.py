from django.db import models

class Deck(models.Model):
    name = models.CharField(max_length=50, unique=True , default="null")

    def __str__(self):
        return f"{self.name}"

class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    rank = models.IntegerField()
    power = models.IntegerField()
    strength = models.IntegerField()
    speed = models.IntegerField()
    intelligence = models.IntegerField()
    height = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.rank}"

    class Meta:
        ordering = ['deck' , 'rank']
        unique_together = ['deck' , 'rank']
