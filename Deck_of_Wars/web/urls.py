from django.urls import path 
from . import views
from django.views.generic import RedirectView

urlpatterns = [
    path('home/' , views.main_menu , name='Menu'),
    path('lobbyp/' , views.Game_setup , name='Create'),
    path('lobbys/' , views.enter_code , name='Join'),
    path('logout/' , views.Logout , name='logout'),
    path('guest/', views.guest_login, name='guest_login'),
    path('register/' ,  views.register , name='register'),
    path('loading/' , views.loading_page , name='Loading_Page'),
    path('profile/' , views.player_card , name='Profile'),
    path('login/', views.login_view, name='login'),
]