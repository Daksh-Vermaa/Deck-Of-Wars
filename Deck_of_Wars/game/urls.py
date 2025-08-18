from django.urls import path 
from . import views

urlpatterns = [
    path('game/' , views.games , name='Game'),
]   