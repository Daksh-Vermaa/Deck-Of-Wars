from django import forms

MODE_SELECTION = [
    ('Ben_10' , 'Ben_10'),
    ('Marvel' , 'Marvel'),
    ('DC' , 'DC')
]


class GameSetup(forms.Form):
    num_players = forms.IntegerField(
        min_value=2 ,
          max_value=4 ,
            label='No of players',
                widget=forms.NumberInput()
            ) 
    
    
    mode = forms.ChoiceField(
        choices=MODE_SELECTION ,
            label='Select Mode',
            )