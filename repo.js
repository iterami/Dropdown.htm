'use strict';

function coin_fall(){
    for(const coin in falling_coins){
        if(falling_coins[coin].y < 15){
            if(falling_coins[coin].y === 14
              && core_elements[195 + falling_coins[coin].x].style.backgroundColor === color_positive){
                const element = core_elements[182 + falling_coins[coin].x];
                element.style.backgroundColor = '';
                element.textContent = '';

                if(falling_coins[coin].value < 0
                  && core_storage_data.purple_catch === 0){
                    core_interval_pause_all();

                }else{
                    audio_start('boop');
                    score += falling_coins[coin].value;
                    core_ui_update({
                      'ids': {
                        'score': score,
                      },
                    });

                    falling_coins.splice(
                      coin,
                      1
                    );

                    coin_fall();
                    return;
                }
            }

            let element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
            element.style.backgroundColor = '';
            element.textContent = '';
            falling_coins[coin].y += 1;

            element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
            const type = falling_coins[coin].value === 1;
            element.style.backgroundColor = type
              ? color_orange
              : color_negative;
            element.textContent = type
              ? '+'
              : '-';

            continue;
        }

        if(falling_coins[coin].value === 1){
            if(core_storage_data.orange_miss === 1){
                core_interval_pause_all();

            }else{
                if(core_storage_data.orange_miss === 2){
                    score--;
                    core_ui_update({
                      'ids': {
                        'score': score,
                      },
                    });
                }

                const element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
                element.style.backgroundColor = '';
                element.textContent = '';
                falling_coins.splice(
                  coin,
                  1
                );

                coin_fall();
             }

        }else{
            const element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
            element.style.backgroundColor = '';
            element.textContent = '';
            falling_coins.splice(
              coin,
              1
            );

            coin_fall();
        }
        return;
    }

    let new_purple_x = -1;

    if(core_storage_data.frames_per_purple > 0
      && frame_purple === Math.floor(core_storage_data.frames_per_purple)){
        new_purple_x = core_random_integer(13);

        falling_coins.push({
          'value': -1,
          'x': new_purple_x,
          'y': 0,
        });

        core_elements[new_purple_x].style.backgroundColor = color_negative;
        core_elements[new_purple_x].textContent = '-';
        frame_purple = -1;
    }

    if(frame_orange === 9){
        let new_orange_x = new_purple_x;
        do{
            new_orange_x = core_random_integer(13);
        }while(new_orange_x === new_purple_x);

        falling_coins.push({
          'value': 1,
          'x': new_orange_x,
          'y': 0,
        });

        core_elements[new_orange_x].style.backgroundColor = color_orange;
        core_elements[new_orange_x].textContent = '+';
        frame_orange = -1;
    }

    frame_orange += 1;
    frame_purple += 1;

    const element = core_elements[195 + player_x];
    element.style.backgroundColor = color_positive;
    element.textContent = '•';
}

function player_move(){
    let move_left = core_keys[core_storage_data['move-←']].state;
    let move_right = core_keys[core_storage_data['move-→']].state;
    if(core_pointer.down_0){
        const position = core_elements[195 + player_x].offsetLeft;
        if(core_pointer.x > position + core_storage_data.width){
            move_right = true;

        }else if(core_pointer.x < position){
            move_left = true;
        }
    }

    if(move_left){
        if(player_x > 0){
            let element = core_elements[195 + player_x];
            element.style.backgroundColor = '';
            element.textContent = '';

            player_x -= 1;

            element = core_elements[195 + player_x];
            element.style.backgroundColor = color_positive;
            element.textContent = '•';

        }else if(core_storage_data.wrap === 1
          || core_storage_data.wrap === 2){
            let element = core_elements[195 + player_x];
            element.style.backgroundColor = '';
            element.textContent = '';

            player_x = 12;

            element = core_elements[195 + player_x];
            element.style.backgroundColor = color_positive;
            element.textContent = '•';
        }

    }else if(move_right){
        if(player_x < 12){
            let element = core_elements[195 + player_x];
            element.style.backgroundColor = '';
            element.textContent = '';

            player_x += 1;

            element = core_elements[195 + player_x];
            element.style.backgroundColor = color_positive;
            element.textContent = '•';

        }else if(core_storage_data.wrap === 1
          || core_storage_data.wrap === 3){
            let element = core_elements[195 + player_x];
            element.style.backgroundColor = '';
            element.textContent = '';

            player_x = 0;

            element = core_elements[195 + player_x];
            element.style.backgroundColor = color_positive;
            element.textContent = '•';
        }
    }
}

function repo_escape(){
    if(!core_intervals.player
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(score !== 0){
                event.preventDefault();
            }
        },
      },
      'events': {
        'start_button': {
          'onclick': start,
        },
      },
      'globals': {
        'color_orange': 'rgb(190, 100, 0)',
        'color_negative': '#663366',
        'color_positive': 'rgb(32, 102, 32)',
        'falling_coins': [],
        'frame_orange': 0,
        'frame_purple': 0,
        'player_x': 6,
        'score': 0,
      },
      'info': '<button id=start_button type=button>Restart</button>',
      'menu': true,
      'pointerbinds': {},
      'storage': {
        'frames_per_purple': 9,
        'height': 25,
        'ms_per_coin_move': 100,
        'ms_per_player_move': 100,
        'orange_miss': 1,
        'purple_catch': 1,
        'width': 25,
        'wrap': 0,
      },
      'storage_controls': true,
      'storage_menu': '<table><tr><td><input class=mini id=height min=1 step=any type=number><td>Button Height'
        + '<tr><td><input class=mini id=width min=1 step=any type=number><td>Button Width'
        + '<tr><td><input class=mini id=frames_per_purple min=1 step=1 type=number><td>Frames/Purple_Coin'
        + '<tr><td><input class=mini id=ms_per_coin_move min=1 step=any type=number><td>ms/Coin_Move'
        + '<tr><td><input class=mini id=ms_per_player_move min=1 step=any type=number><td>ms/Player_Move'
        + '<tr><td><select id=orange_miss><option value=0>Disappear<option selected value=1>End Game<option value=2>Score-1</select><td>Orange Coin Miss'
        + '<tr><td><select id=purple_catch><option value=0>End Game<option selected value=1>Score-1</select><td>Purple Coin Catch'
        + '<tr><td><select id=wrap><option value=0>No<option value=1>Both<option value=2>Left<option value=3>Right</select><td>Wrap</table>',
      'title': 'Dropdown.htm',
      'ui_elements': [
        'game',
      ],
    });

    let output = '';
    for(let loop_counter = 0; loop_counter < 208; loop_counter++){
        if(loop_counter % 13 === 0 && loop_counter !== 0){
            output += '<br>';
        }

        output += '<button class=gridbutton disabled id=' + loop_counter + ' type=button></button>';
    }
    core_elements.game.innerHTML = output + '<br>';
    core_elements.game.style.minWidth = '360px';
    reset();
}

function reset(){
    let loop_counter = 207;
    do{
        if(!core_elements[loop_counter]){
            core_elements[loop_counter] = document.getElementById(loop_counter);
        }

        core_elements[loop_counter].style.backgroundColor = '';
        core_elements[loop_counter].style.fontSize = Math.ceil(core_storage_data.height / 2) + 'px';
        core_elements[loop_counter].style.height = core_storage_data.height + 'px';
        core_elements[loop_counter].style.lineHeight = Math.ceil(core_storage_data.height / 2) + 'px';
        core_elements[loop_counter].style.width = core_storage_data.width + 'px';
        core_elements[loop_counter].textContent = '';
    }while(loop_counter--);
    core_elements[201].style.backgroundColor = color_positive;
    core_elements[201].textContent = '•';

    core_elements.game.style.lineHeight = core_storage_data.height + 'px';
    score = 0;
    core_object_reset(falling_coins);
    frame_orange = 9;
    frame_purple = 0;
    player_x = 6;
}

function start(){
    if(score !== 0
      && !globalThis.confirm('Start new game?')){
        return;
    }
    if(core_menu_open){
        core_escape(false);
    }
    reset();

    core_interval_modify({
      'id': 'coins',
      'interval': core_storage_data.ms_per_coin_move,
      'todo': coin_fall,
    });
    core_interval_modify({
      'id': 'player',
      'interval': core_storage_data.ms_per_player_move,
      'todo': player_move,
    });
}
