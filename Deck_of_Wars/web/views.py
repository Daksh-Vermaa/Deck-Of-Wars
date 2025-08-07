from django.shortcuts import render, redirect
from .models import Player
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login , logout
from django.contrib.auth.decorators import login_required
from django.utils.crypto import get_random_string
from .models import GameSession
from .forms import GameSetup
import secrets
import json


def main_menu(request):
    return render(request ,
                   'web/home.html' ,
                     {'title' : 'Main Menu'}
                    )

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
        elif User.objects.filter(username=username).exists():
            messages.error(request , f'{username} already exists')
        elif User.objects.filter(email=email).exists():
            messages.error(request , f'{email} already exists')
        else :
            user = User.objects.create_user(username=username ,
                                             email=email ,
                                               password=password
                                            )
            user.save()
            messages.success(request , f'Signup completed . You can login now')
            return redirect('login')
    else :
        messages.error(request , "Passwords do not match")
    return render(request , 'web/register.html' ,
                   {'title' : 'register'}
                )

def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']        
        user = authenticate(request ,
                             username=username ,
                               password=password
                            )

        if user is not None:
            auth_login(request , user)
            return redirect('Menu')
    
    return render(request , 'web/login.html' ,
                   {'title' : 'login'}
                )

def guest_login(request):
    username = f"guest_id_|{get_random_string(6)}|"
    user = User.objects.create_user(username)
    user.set_unusable_password()
    user.save()
    
    auth_login(request , user)
    return redirect('Menu')

@login_required
def Logout(request):
    user =  User.objects.filter(username__startswith="guest_")
    if user :
        user.delete()
        
    logout(request)
    messages.success(request , f'logged out succesfully')
    return redirect('Menu')


def create_a_team(request):
    if not request.user.is_authenticated:
        messages.error(request , f'login first')
        return redirect('Login')
    return render(request , 'web/lobbyp.html' ,
                   {'title' : 'Primary_Lobby'}
                )

def join_a_team(request):
    if not request.user.is_authenticated:
        messages.error(request , f'login first')
        return redirect('Login')
    return render(request , 'web/lobbys.html' ,
                   {'title' : 'Secondaary_Lobby'}
                )

def create_code():
    code = secrets.token_urlsafe(6)[:6].upper()
    return code

def Game_setup(request):
    if request.method == 'POST':  
        form = GameSetup(request.POST)  
        if form.is_valid(): 

            num_players = form.cleaned_data['num_players'] 
            mode = form.cleaned_data['mode'] 

            game_session = GameSession.objects.create(
                code = create_code(),
                num_players = num_players,
                mode = mode,
                name = request.user 
            )
            return redirect(f'/loading/?players={game_session.num_players}&mode={game_session.mode}&code={game_session.code}')
        else:
            messages.error(request, 'Form validation failed')
    else:
        form = GameSetup()
    return render(request, 'web/lobbyp.html', {'form': form,
                                                'title': 'Game Setup'})

def loading_page(request):
    num_players = request.GET.get('players')
    mode = request.GET.get('mode')
    code = request.GET.get('code')

    if code :
        try :
            game_session = GameSession.objects.get(num_players=num_players , mode=mode , code=code  , is_active=True)
            return render(request , 'web/loading.html' , {'title' : 'loading',
                                            'num_players' : game_session.num_players,
                                            'mode' : game_session.mode,
                                            'code': game_session.code,
                                            'players_joined' : game_session.get_players(),
                                            'NO' : len(game_session.get_players())}
                                            )

        except GameSession.DoesNotExist:
            messages.error(request , 'code incorrect')

    else :
        messages.error(request , 'failed to create code')

def enter_code(request):
    if request.method == 'POST':
        global code
        global num_players
        global mode
        
        passcode = request.POST['passcode']
        if passcode !=  code:
            messages.error(request , f'PASSCODE DOES NOT EXIST')
        else :
            return redirect(f'/loading/?players={num_players}&mode={mode}&code={code}')