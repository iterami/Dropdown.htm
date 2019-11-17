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
      'storage-menu': '<table><tr><td><input id=height><td>Button Height'
        + '<tr><td><input id=width><td>Button Width'
        + '<tr><td><input id=frames-per-purple><td>Frames/Purple_Coin'
        + '<tr><td><input id=ms-per-coin-move><td>ms/Coin_Move'
        + '<tr><td><input id=ms-per-player-move><td>ms/Player_Move'
        + '<tr><td><select id=orange-miss><option value=0>Disappear</option><option selected value=1>End Game</option><option value=2>Score-1</option></select><td>Orange Coin Miss'
        + '<tr><td><select id=purple-catch><option value=0>End Game</option><option selected value=1>Score-1</option></select><td>Purple Coin Catch'
        + '<tr><td><select id=wrap><option value=0>—</option><option value=2>←</option><option value=3>→</option><option value=1>↔</option></select><td>Wrap</table>',
      'title': 'Dropdown.htm',
    });
    audio_create({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
    });

    // Setup game div.
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
          + ' style="background:' + color
          + '" type=button'
          + (value.length > 0 ? ' value=' + value : '')
          + '>';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';
}
