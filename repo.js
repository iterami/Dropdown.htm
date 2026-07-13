'use strict';

function coin_fall(){
    for(const coin in falling_coins){
        if(falling_coins[coin].y < 15){
            if(falling_coins[coin].y === 14){
                const rgb = core_hex_to_rgb(core_storage_data.player_color);
                const color = 'rgb(' + rgb.red + ', ' + rgb.green + ', ' + rgb.blue + ')';

                if(core_elements[195 + falling_coins[coin].x].style.backgroundColor === color){
                    const element = core_elements[182 + falling_coins[coin].x];
                    element.style.backgroundColor = '';
                    element.textContent = '';

                    if(falling_coins[coin].value < 0
                      && core_storage_data.negative_catch === 0){
                        core_interval_lock_all();

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
            }

            let element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
            element.style.backgroundColor = '';
            element.textContent = '';
            falling_coins[coin].y += 1;

            element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
            const type = falling_coins[coin].value === 1;
            element.style.backgroundColor = type
              ? core_storage_data.positive_color
              : core_storage_data.negative_color;
            element.textContent = type
              ? '+'
              : '-';

            continue;
        }

        if(falling_coins[coin].value === 1){
            if(core_storage_data.positive_miss === 1){
                audio_start('boop');
                core_interval_lock_all();
                return;

            }else{
                if(core_storage_data.positive_miss === 2){
                    audio_start('boop');
                    core_ui_update({
                      'ids': {
                        'score': --score,
                      },
                    });
                }
            }
        }

        const element = core_elements[falling_coins[coin].x + 13 * falling_coins[coin].y];
        element.style.backgroundColor = '';
        element.textContent = '';
        falling_coins.splice(
          coin,
          1
        );

        coin_fall();
        return;
    }

    let new_negative_x = -1;

    if(core_storage_data.frames_per_negative > 0
      && frame_negative++ === Math.floor(core_storage_data.frames_per_negative)){
        new_negative_x = core_random_integer(13);

        falling_coins.push({
          'value': -1,
          'x': new_negative_x,
          'y': 0,
        });

        core_elements[new_negative_x].style.backgroundColor = core_storage_data.negative_color;
        core_elements[new_negative_x].textContent = '-';
        frame_negative = 0;
    }
    if(frame_positive++ === core_storage_data.frames_per_positive){
        const choices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        choices.splice(new_negative_x, 1);
        const new_positive_x = core_random_splice(choices);

        falling_coins.push({
          'value': 1,
          'x': new_positive_x,
          'y': 0,
        });

        core_elements[new_positive_x].style.backgroundColor = core_storage_data.positive_color;
        core_elements[new_positive_x].textContent = '+';
        frame_positive = 0;
    }

    const element = core_elements[195 + player_x];
    element.style.backgroundColor = core_storage_data.player_color;
    element.textContent = '•';
}

function player_move(){
    let move_left = core_keys[core_storage_data.move_left].state;
    let move_right = core_keys[core_storage_data.move_right].state;
    if(core_pointer.down_0){
        const position = core_elements[195 + player_x];
        if(core_pointer.x > position.offsetLeft + position.clientWidth){
            move_right = true;

        }else if(core_pointer.x < position.offsetLeft){
            move_left = true;
        }
    }

    const old_x = player_x;
    if(move_left){
        if(player_x > 0){
            player_x -= 1;

        }else if(core_storage_data.wrap === 1
          || core_storage_data.wrap === 2){
            player_x = 12;
        }

    }else if(move_right){
        if(player_x < 12){
            player_x += 1;

        }else if(core_storage_data.wrap === 1
          || core_storage_data.wrap === 3){
            player_x = 0;
        }
    }
    if(player_x !== old_x){
        const old_element = core_elements[195 + old_x];
        old_element.style.backgroundColor = '';
        old_element.textContent = '';

        const new_element = core_elements[195 + player_x];
        new_element.style.backgroundColor = core_storage_data.player_color;
        new_element.textContent = '•';
    }
}

function repo_escape(){
    audio_state_all(!core_menu_open);

    if(!core_intervals.player
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': function(event){
          if(score !== 0){
              core_escape(true);
              event.preventDefault();
          }
      },
      'events': {
        'start': {
          'onclick': start,
        },
      },
      'globals': {
        'falling_coins': [],
        'frame_negative': 0,
        'frame_positive': 0,
        'player_x': 6,
        'score': 0,
      },
      'info': '<button class=medium id=start type=button>Start New Game</button>',
      'menu': true,
      'pointerbinds': {},
      'storage': {
        'frames_per_negative': 9,
        'frames_per_positive': 10,
        'height': '25px',
        'ms_per_coin_move': 100,
        'ms_per_player_move': 100,
        'negative_catch': 1,
        'negative_color': '#663366',
        'player_color': '#206620',
        'positive_color': '#be6400',
        'positive_miss': 1,
        'width': '25px',
        'wrap': 0,
      },
      'storage_controls': true,
      'storage_menu': '<table><tr><td><input class=mini id=height type=text><td>Button Height'
        + '<tr><td><input class=mini id=width type=text><td>Button Width'
        + '<tr><td><input class=mini id=frames_per_negative min=0 step=1 type=number><td>Frames/Negative_Coin'
        + '<tr><td><input class=mini id=frames_per_positive min=1 step=1 type=number><td>Frames/Positive_Coin'
        + '<tr><td><input class=mini id=ms_per_coin_move min=1 step=any type=number><td>ms/Coin_Move'
        + '<tr><td><input class=mini id=ms_per_player_move min=1 step=any type=number><td>ms/Player_Move'
        + '<tr><td><select id=negative_catch><option value=0>End Game<option selected value=1>Score-1</select><td>Negative Coin Catch'
        + '<tr><td><input id=negative_color type=color><td>Negative Coin Color'
        + '<tr><td><input id=player_color type=color><td>Player Color'
        + '<tr><td><select id=positive_miss><option value=0>Disappear<option selected value=1>End Game<option value=2>Score-1</select><td>Positive Coin Miss'
        + '<tr><td><input id=positive_color type=color><td>Positive Coin Color'
        + '<tr><td><select id=wrap><option value=0>No<option value=1>Both<option value=2>Left<option value=3>Right</select><td>Wrap</table>',
      'title': 'Dropdown.htm',
      'ui': ' <span id=score></span>',
      'ui_elements': ['game'],
    });

    let output = '';
    for(let i = 0; i < 208; i++){
        if(i % 13 === 0 && i !== 0){
            output += '<br>';
        }

        output += '<button class=gridbutton disabled id=' + i + ' type=button></button>';
    }
    core_elements.game.innerHTML = output;

    for(let i = 0; i < 208; i++){
        core_elements[i] = document.getElementById(i);
    }

    update_css();
}

function reset(){
    score = 0;
    core_ui_update({
      'ids': {
        'score': score,
      },
    });
    core_object_reset(falling_coins);
    frame_negative = 0;
    frame_positive = core_storage_data.frames_per_positive;
    player_x = 6;

    for(let i = 0; i < 208; i++){
        core_elements[i].style.backgroundColor = '';
        core_elements[i].style.height = core_storage_data.height;
        core_elements[i].style.width = core_storage_data.width;
        core_elements[i].textContent = '';

        const half = Math.ceil(core_elements[i].offsetWidth / 2) + 'px';
        core_elements[i].style.fontSize = half;
        core_elements[i].style.lineHeight = half;
    }
    core_elements[201].style.backgroundColor = core_storage_data.player_color;
    core_elements[201].textContent = '•';

    update_css();
}

function start(){
    if(score !== 0
      && !globalThis.confirm('Start new game?')){
        return;
    }
    reset();
    core_escape(false);

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

function update_css(){
    core_elements.game.style.lineHeight = core_storage_data.height;
    core_elements.game.style.minWidth = (core_elements[0].offsetWidth * 13 + 26) + 'px';
}
