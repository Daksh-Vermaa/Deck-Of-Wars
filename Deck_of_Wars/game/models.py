from django.db import models

class Deck(models.Model):
    deck_data = models.JSONField()

