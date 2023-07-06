'use strict';

function repo_escape(){
    if(!core_intervals['player']
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start-button': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'color_empty': 'rgb(42, 42, 42)',
        'color_orange': 'rgb(190, 100, 0)',
        'color_positive': '',
        'falling_coins': [],
        'frame_orange': 0,
        'frame_purple': 0,
        'player_x': 6,
      },
      'info': '<input id=start-button type=button value=Restart>',
      'menu': true,
      'reset': function(){
          stop();
          if(core_menu_open){
              core_escape();
          }
          start();
      },
      'storage': {
        'frames-per-purple': 9,
        'height': '25px',
        'ms-per-coin-move': 100,
        'ms-per-player-move': 100,
        'orange-miss': 1,
        'purple-catch': 1,
        'width': '25px',
        'wrap': 0,
      },
      'storage-menu': '<table><tr><td><input class=mini id=height type=text><td>Button Height'
        + '<tr><td><input class=mini id=width type=text><td>Button Width'
        + '<tr><td><input class=mini id=frames-per-purple min=1 step=any type=number><td>Frames/Purple_Coin'
        + '<tr><td><input class=mini id=ms-per-coin-move min=1 step=any type=number><td>ms/Coin_Move'
        + '<tr><td><input class=mini id=ms-per-player-move min=1 step=any type=number><td>ms/Player_Move'
        + '<tr><td><select id=orange-miss><option value=0>Disappear</option><option selected value=1>End Game</option><option value=2>Score-1</option></select><td>Orange Coin Miss'
        + '<tr><td><select id=purple-catch><option value=0>End Game</option><option selected value=1>Score-1</option></select><td>Purple Coin Catch'
        + '<tr><td><select id=wrap><option value=0>No</option><option value=1>Both</option><option value=2>Left</option><option value=3>Right</option></select><td>Wrap</table>',
      'title': 'Dropdown.htm',
    });
    audio_create({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
    });

    let output = '';
    for(let loop_counter = 0; loop_counter < 208; loop_counter++){
        if(loop_counter % 13 === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        let color = color_empty;
        let value = '';

        if(loop_counter === 201){
            color = core_storage_data['color-positive'];
            value = '•';
        }

        output +=
          '<input class=gridbutton disabled id=' + loop_counter
          + ' style="background-color:' + color
          + '" type=button'
          + (value.length ? ' value=' + value : '')
          + '>';
    }
    const gamediv = document.getElementById('game-div');
    gamediv.innerHTML = output + '<br>';
    gamediv.style.minWidth = '360px';
}
