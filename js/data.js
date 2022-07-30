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
              : core_storage_data['color-negative'];
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
        element.style.backgroundColor = core_storage_data['color-negative'];
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
    element.style.backgroundColor = core_storage_data['color-positive'];
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
            element.style.backgroundColor = core_storage_data['color-positive'];
            element.value = '•';

        }else if(core_storage_data['wrap'] === 1
          || core_storage_data['wrap'] === 2){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x = 12;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = core_storage_data['color-positive'];
            element.value = '•';
        }

    }else if(core_keys[core_storage_data['move-→']]['state']){
        if(player_x < 12){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x += 1;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = core_storage_data['color-positive'];
            element.value = '•';

        }else if(core_storage_data['wrap'] === 1
          || core_storage_data['wrap'] === 3){
            let element = document.getElementById(195 + player_x);
            element.style.backgroundColor = color_empty;
            element.value = '';

            player_x = 0;

            element = document.getElementById(195 + player_x);
            element.style.backgroundColor = core_storage_data['color-positive'];
            element.value = '•';
        }
    }
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
    element.style.backgroundColor = core_storage_data['color-positive'];
    element.value = '•';

    const rgb = core_hex_to_rgb({
      'hex': core_storage_data['color-positive'],
    });

    document.getElementById('score').textContent = 0;
    color_positive = 'rgb(' + rgb['red'] + ', ' + rgb['green'] + ', ' + rgb['blue'] + ')';
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
