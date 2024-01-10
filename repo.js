'use strict';

function coin_fall(){
    for(const coin in falling_coins){
        if(falling_coins[coin]['y'] < 15){
            if(falling_coins[coin]['y'] === 14
              && document.getElementById(195 + falling_coins[coin]['x']).style.backgroundColor === color_positive){
                const element = document.getElementById(182 + falling_coins[coin]['x']);
                element.style.backgroundColor = color_empty;
                element.value = '';

                if(falling_coins[coin]['value'] < 0
                  && core_storage_data['purple-catch'] === 0){
                    core_interval_pause_all();

                }else{
                    audio_start({
                      'id': 'boop',
                    });

                    const score = document.getElementById('score');
                    score.textContent = Number.parseInt(
                      score.textContent,
                      10
                    ) + falling_coins[coin]['value'];

                    falling_coins.splice(
                      coin,
                      1
                    );

                    coin_fall();
                    return;
                }
            }

            let element = document.getElementById(falling_coins[coin]['x'] + 13 * falling_coins[coin]['y']);
            element.style.backgroundColor = color_empty;
            element.value = '';
            falling_coins[coin]['y'] += 1;

            element = document.getElementById(falling_coins[coin]['x'] + 13 * falling_coins[coin]['y']);
            const type = falling_coins[coin]['value'] === 1;
            element.style.backgroundColor = type
              ? color_orange
              : color_negative;
            element.value = type
              ? '+'
              : '-';

            continue;
        }

        if(falling_coins[coin]['value'] === 1){
            if(core_storage_data['orange-miss'] === 1){
                core_interval_pause_all();

            }else{
                if(core_storage_data['orange-miss'] === 2){
                    const element = document.getElementById('score');
                    element.textContent = Number.parseInt(
                      element.textContent,
                      10
                    ) - 1;
                }

                const element = document.getElementById(falling_coins[coin]['x'] + 13 * falling_coins[coin]['y']);
                element.style.backgroundColor = color_empty;
                element.value = '';
                falling_coins.splice(
                  coin,
                  1
                );

                coin_fall();
             }

        }else{
            const element = document.getElementById(falling_coins[coin]['x'] + 13 * falling_coins[coin]['y']);
            element.style.backgroundColor = color_empty;
            element.value = '';
            falling_coins.splice(
              coin,
              1
            );

            coin_fall();
        }
        return;
    }

    let new_purple_x = -1;

    if(core_storage_data['frames-per-purple'] > 0
      && frame_purple === core_storage_data['frames-per-purple']){
        new_purple_x = core_random_integer({
          'max': 13,
        });

        falling_coins.push({
          'value': -1,
          'x': new_purple_x,
          'y': 0,
        });

        const element = document.getElementById(new_purple_x);
        element.style.backgroundColor = color_negative;
        element.value = '-';
        frame_purple = -1;
    }

    if(frame_orange === 9){
        let new_orange_x = new_purple_x;
        do{
            new_orange_x = core_random_integer({
              'max': 13,
            });
        }while(new_orange_x === new_purple_x);

        falling_coins.push({
          'value': 1,
          'x': new_orange_x,
          'y': 0,
        });

        const element = document.getElementById(new_orange_x);
        element.style.backgroundColor = color_orange;
        element.value = '+';
        frame_orange = -1;
    }

    frame_orange += 1;
    frame_purple += 1;

    const element = document.getElementById(195 + player_x);
    element.style.backgroundColor = color_positive;
    element.value = '•';
}

function player_move(){
    if(core_keys[core_storage_data['move-←']]['state']){
        if(player_x > 0){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x -= 1;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_positive;
            element.value = '•';

        }else if(core_storage_data['wrap'] === 1
          || core_storage_data['wrap'] === 2){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x = 12;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_positive;
            element.value = '•';
        }

    }else if(core_keys[core_storage_data['move-→']]['state']){
        if(player_x < 12){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x += 1;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_positive;
            element.value = '•';

        }else if(core_storage_data['wrap'] === 1
          || core_storage_data['wrap'] === 3){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x = 0;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_positive;
            element.value = '•';
        }
    }
}

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
        'color_negative': '#663366',
        'color_positive': 'rgb(32, 102, 32)',
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
        + '<tr><td><select id=orange-miss><option value=0>Disappear<option selected value=1>End Game<option value=2>Score-1</select><td>Orange Coin Miss'
        + '<tr><td><select id=purple-catch><option value=0>End Game<option selected value=1>Score-1</select><td>Purple Coin Catch'
        + '<tr><td><select id=wrap><option value=0>No<option value=1>Both<option value=2>Left<option value=3>Right</select><td>Wrap</table>',
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
            color = color_positive;
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

function start(){
    let loop_counter = 207;
    do{
        const element = document.getElementById(loop_counter);

        element.style.backgroundColor = color_empty;
        element.style.height = core_storage_data['height'];
        element.style.width = core_storage_data['width'];
        element.value = '';
    }while(loop_counter--);
    const element = document.getElementById(201);
    element.style.backgroundColor = color_positive;
    element.value = '•';

    const rgb = core_hex_to_rgb('#206620');

    document.getElementById('score').textContent = 0;
    falling_coins.length = 0;
    frame_orange = 9;
    frame_purple = 0;
    player_x = 6;

    core_interval_modify({
      'id': 'coins',
      'interval': core_storage_data['ms-per-coin-move'],
      'todo': coin_fall,
    });
    core_interval_modify({
      'id': 'player',
      'interval': core_storage_data['ms-per-player-move'],
      'todo': player_move,
    });
}
