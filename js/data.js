'use strict';

function coin_fall(){
    for(let coin in falling_coins){
        // If coin is not at the bottom of the game-div.
        if(falling_coins[coin]['y'] < 15){
            // If coin is at a y position to be caught and it is directly above the player.
            if(falling_coins[coin]['y'] === 14
              && document.getElementById(195 + falling_coins[coin]['x']).style.backgroundColor === core_hex_to_rgb({
                'hex': core_storage_data['color-positive'],
              })){
                // Set button color to empty.
                document.getElementById(182 + falling_coins[coin]['x']).style.backgroundColor = color_empty;

                // If it is a purple coins and catching purple coins ends the game, end the game.
                if(falling_coins[coin]['value'] < 0
                  && core_storage_data['purple-catch'] === 0){
                    core_interval_pause_all();

                // Else adjust the score by the point value of the coin.
                }else{
                    core_audio_start({
                      'id': 'boop',
                    });

                    let element = document.getElementById('score');
                    element.innerHTML = Number.parseInt(
                      element.innerHTML,
                      10
                    ) + falling_coins[coin]['value'];

                    // Remove the coin.
                    falling_coins.splice(
                      coin,
                      1
                    );

                    // Restart coin_fall function.
                    coin_fall();
                    return;
                }
            }

            // Update coin Y value.
            let id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
            document.getElementById(id).style.backgroundColor = color_empty;
            falling_coins[coin]['y'] += 1;

            // Draw coin at new Y position.
            id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
            document.getElementById(id).style.backgroundColor = (falling_coins[coin]['value'] === 1)
              ? color_orange
              : core_storage_data['color-negative'];

            continue;
        }

        // If it is an orange coin.
        if(falling_coins[coin]['value'] === 1){
            // If missing an orange coin causes game to end, end the game.
            if(core_storage_data['orange-miss'] === 1){
                core_interval_pause_all();

            }else{
                // If missing an orange coin decreases score, decrease score.
                if(core_storage_data['orange-miss'] == 2){
                    let element = document.getElementById('score');
                    element.innerHTML = Number.parseInt(
                      element.innerHTML,
                      10
                    ) - 1;
                }

                // Delete orange coin.
                let id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
                document.getElementById(id).style.backgroundColor = color_empty;
                falling_coins.splice(
                  coin,
                  1
                );

                // Restart function.
                coin_fall();
             }

        }else{
            // Delete and ignore purple coin.
            let id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
            document.getElementById(id).style.backgroundColor = color_empty;
            falling_coins.splice(
              coin,
              1
            );

            // Restart function.
            coin_fall();
        }
        return;
    }

    let new_purple_x = -1;

    // If there are purple buttons and it is time to add one...
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

        document.getElementById(new_purple_x).style.backgroundColor = core_storage_data['color-negative'];
        frame_purple = -1;
    }

    // If it is time to add an orange button...
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

        document.getElementById(new_orange_x).style.backgroundColor = color_orange;
        frame_orange = -1;
    }

    // Increase frame counters.
    frame_orange += 1;
    frame_purple += 1;

    // Draw player button just in case it was overwritten.
    document.getElementById(195 + player_x).style.backgroundColor = core_storage_data['color-positive'];
}

function player_move(){
    if(core_keys[core_storage_data['move-←']]['state']){
        if(player_x > 0){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x -= 1;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = core_storage_data['color-positive'];

        // Check if player can wrap around left side of game-div.
        }else if(core_storage_data['wrap'] === 1
          || core_storage_data['wrap'] === 2){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x = 12;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = core_storage_data['color-positive'];
        }

    }else if(core_keys[core_storage_data['move-→']]['state']){
        if(player_x < 12){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x += 1;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = core_storage_data['color-positive'];

        // Check if player can wrap around right side of game-div.
        }else if(core_storage_data['wrap'] === 1
          || core_storage_data['wrap'] === 3){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x = 0;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = core_storage_data['color-positive'];
        }
    }
}

function start(){
    // Reset colors of buttons.
    let loop_counter = 207;
    do{
        let element = document.getElementById(loop_counter);

        element.style.backgroundColor = color_empty;
        element.style.height = core_storage_data['height'];
        element.style.width = core_storage_data['width'];
    }while(loop_counter--);
    document.getElementById(201).style.backgroundColor = core_storage_data['color-positive'];

    document.getElementById('score').innerHTML = 0;
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
