'use strict';

function coin_fall(){
    for(var coin in falling_coins){
        // If coin is not at the bottom of the game-div.
        if(falling_coins[coin]['y'] < 15){
            // If coin is at a y position to be caught and it is directly above the player.
            if(falling_coins[coin]['y'] === 14
              && document.getElementById(195 + falling_coins[coin]['x']).style.backgroundColor === core_storage_data['color-positive']){
                // Set button color to empty.
                document.getElementById(182 + falling_coins[coin]['x']).style.backgroundColor = color_empty;

                // If it is a purple coins and catching purple coins ends the game, end the game.
                if(falling_coins[coin]['value'] < 0
                  && core_storage_data['purple-catch'] === 0){
                    stop();

                // Else adjust the score by the point value of the coin.
                }else{
                    core_audio_start({
                      'id': 'boop',
                    });

                    document.getElementById('score').innerHTML = parseInt(
                      document.getElementById('score').innerHTML,
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
            var id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
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
                stop();

            }else{
                // If missing an orange coin decreases score, decrease score.
                if(core_storage_data['orange-miss'] == 2){
                    document.getElementById('score').innerHTML = parseInt(
                      document.getElementById('score').innerHTML,
                      10
                    ) - 1;
                }

                // Delete orange coin.
                var id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
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
            var id = falling_coins[coin]['x'] + 13 * falling_coins[coin]['y'];
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

    var new_purple_x = -1;

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
        var new_orange_x = new_purple_x;
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
    if(core_keys[65]['state']){
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

    }else if(core_keys[68]['state']){
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

function repo_escape(){
    stop();
}

function repo_init(){
    core_repo_init({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
      'keybinds': {
        65: {},
        68: {},
        72: {
          'todo': function(){
              stop();
              start();
          },
        },
      },
      'storage': {
        'frames-per-purple': 9,
        'game-mode': 1,
        'max': 0,
        'movement-keys': 'AD',
        'ms-per-coin-move': 100,
        'ms-per-player-move': 100,
        'orange-miss': 1,
        'purple-catch': 1,
        'wrap': 0,
      },
      'storage-menu': '<table><tr><td><input id=frames-per-purple><td>Frames/Purple_Coin<tr><td><input id=max><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select><tr><td><input id=movement-keys maxlength=2><td>Move<tr><td><input id=ms-per-coin-move><td>ms/Coin_Move<tr><td><input id=ms-per-player-move><td>ms/Player_Move<tr><td><select id=orange-miss><option value=0>Disappear</option><option selected value=1>End Game</option><option value=2>Score-1</option></select><td>Orange Coin Miss<tr><td><select id=purple-catch><option value=0>End Game</option><option selected value=1>Score-1</option></select><td>Purple Coin Catch<tr><td><select id=wrap><option value=0>—</option><option value=2>←</option><option value=3>→</option><option value=1>↔</option></select><td>Wrap</table>',
      'title': 'Dropdown.htm',
    });

    // Setup game div.
    var output = '';
    for(var loop_counter = 0; loop_counter < 208; loop_counter++){
        if(loop_counter % 13 === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        var color = loop_counter == 201
          ? core_storage_data['color-positive']
          : color_empty;

        output +=
          '<input class=gridbutton disabled id=' + loop_counter
          + ' style="background:' + color
          + '" type=button>';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    stop();

    document.getElementById('start-button').onclick = start;
}

function start(){
    core_storage_save();

    // Reset colors of buttons.
    var loop_counter = 207;
    do{
        document.getElementById(loop_counter).style.backgroundColor = color_empty;
    }while(loop_counter--);
    document.getElementById(201).style.backgroundColor = core_storage_data['color-positive'];

    document.getElementById('score').innerHTML = 0;
    document.getElementById('start-button').value = 'End [ESC]';
    document.getElementById('start-button').onclick = stop;
    falling_coins.length = 0;
    frame_orange = 9;
    frame_purple = 0;
    player_x = 6;

    // Max time mode.
    if(core_storage_data['game-mode'] == 1){
        document.getElementById('time').innerHTML = core_storage_data['max'];
        document.getElementById('time-max').innerHTML = core_storage_data['max'];
        document.getElementById('score-max').innerHTML = '';
        document.getElementById('time-max-span').style.display = core_storage_data['max'] > 0
          ? 'inline'
          : 'none';
        interval_time = window.setInterval(
          function(){
              time_interval(1);
          },
          100
        );

    // Max points mode.
    }else{
        document.getElementById('time').innerHTML = 0;
        document.getElementById('time-max-span').style.display = 'none';
        document.getElementById('score-max').innerHTML = core_storage_data['max'] > 0
          ? ' / ' + core_storage_data['max']
          : '';
        interval_time = window.setInterval(
          function(){
              time_interval(0);
          },
          100
        );
    }

    interval_coins = window.setInterval(
        coin_fall,
        core_storage_data['ms-per-coin-move'] > 0
          ? core_storage_data['ms-per-coin-move']
          : 100
    );
    interval_player = window.setInterval(
        player_move,
        core_storage_data['ms-per-coin-move'] > 0
          ? core_storage_data['ms-per-coin-move']
          : 100
    );
}

function stop(){
    window.clearInterval(interval_coins);
    window.clearInterval(interval_player);
    window.clearInterval(interval_time);

    document.getElementById('start-button').onclick = start;
    document.getElementById('start-button').value = 'Start [H]';
}

function time_interval(mode){
    // Max time mode game over.
    if(mode === 1
      && parseFloat(document.getElementById('time').innerHTML) <= 0
      && core_storage_data['max'] > 0){
        stop();
        return;

    // Max points mode game over.
    }else if(core_storage_data['max'] > 0
      && parseInt(document.getElementById('score').innerHTML, 10) >= core_storage_data['max']){
        stop();
        return;
    }

    // Handle time.
    document.getElementById('time').innerHTML =
      (parseFloat(document.getElementById('time').innerHTML) + ((core_storage_data['game-mode'] == 1
        && core_storage_data['max'] > 0)
        ? -.1
        : .1)
      ).toFixed(1);
}

var color_empty = 'rgb(42, 42, 42)';
var color_orange = 'rgb(190, 100, 0)';
var falling_coins = [];
var frame_orange = 0;
var frame_purple = 0;
var interval_coins = 0;
var interval_player = 0;
var interval_time = 0;
var player_x = 6;
