from django.urls import path 
from . import views


urlpatterns = [
    path('' , views.main_menu , name='Menu'),
    path('lobbyp/' , views.Game_setup , name='Create'),
    path('lobbys/' , views.enter_code , name='Join'),
    path('logout/' , views.Logout , name='logout'),
    path('guest/', views.guest_login, name='guest_login'),
    path('register/' ,  views.register , name='register'),
    path('login/' ,  views.login , name='login'),
    path('loading/' , views.loading_page , name='Loading_Page')
]