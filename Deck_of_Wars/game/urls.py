from django.urls import path 
from . import views

urlpatterns = [
    path('Game/' , views.games , name='Game'),
]   