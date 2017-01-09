'use strict';

function coin_fall(){
    for(var coin in falling_coins){
        // If coin is not at the bottom of the game-div.
        if(falling_coins[coin]['y'] < 15){
            // If coin is at a y position to be caught and it is directly above the player.
            if(falling_coins[coin]['y'] === 14
              && document.getElementById(195 + falling_coins[coin]['x']).style.backgroundColor === color_player){
                // Set button color to empty.
                document.getElementById(182 + falling_coins[coin]['x']).style.backgroundColor = color_empty;

                // If it is a purple coins and catching purple coins ends the game, end the game.
                if(falling_coins[coin]['value'] < 0
                  && settings_settings['purple-catch'] === 0){
                    stop();

                // Else adjust the score by the point value of the coin.
                }else{
                    audio_start({
                      'id': 'boop',
                      'volume-multiplier': settings_settings['audio-volume'],
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
              : color_purple;

            continue;
        }

        // If it is an orange coin.
        if(falling_coins[coin]['value'] === 1){
            // If missing an orange coin causes game to end, end the game.
            if(settings_settings['orange-miss'] === 1){
                stop();

            }else{
                // If missing an orange coin decreases score, decrease score.
                if(settings_settings['orange-miss'] == 2){
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
    if(settings_settings['frames-per-purple'] > 0
      && frame_purple === settings_settings['frames-per-purple']){
        new_purple_x = random_integer({
          'max': 13,
        });

        falling_coins.push({
          'value': -1,
          'x': new_purple_x,
          'y': 0,
        });

        document.getElementById(new_purple_x).style.backgroundColor = color_purple;
        frame_purple = -1;
    }

    // If it is time to add an orange button...
    if(frame_orange === 9){
        var new_orange_x = new_purple_x;
        do{
            new_orange_x = random_integer({
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
    document.getElementById(195 + player_x).style.backgroundColor = color_player;
}

function player_move(){
    if(key_left){
        if(player_x > 0){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x -= 1;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = color_player;

        // Check if player can wrap around left side of game-div.
        }else if(settings_settings['wrap'] === 1
          || settings_settings['wrap'] === 2){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x = 12;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = color_player;
        }

    }else if(key_right){
        if(player_x < 12){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x += 1;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = color_player;

        // Check if player can wrap around right side of game-div.
        }else if(settings_settings['wrap'] === 1
          || settings_settings['wrap'] === 3){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x = 0;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = color_player;
        }
    }
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('settings-button').value === '+'
      : state;

    if(state){
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('settings-button').value = '-';

    }else{
        document.getElementById('settings').style.display = 'none';
        document.getElementById('settings-button').value = '+';
    }
}

function start(){
    settings_save();

    // Set margin-top of game-div based on y-margin.
    document.getElementById('game-div').style.marginTop = settings_settings['y-margin'] + 'px';

    // Reset colors of buttons.
    var loop_counter = 207;
    do{
        document.getElementById(loop_counter).style.backgroundColor = color_empty;
    }while(loop_counter--);
    document.getElementById(201).style.backgroundColor = color_player;

    document.getElementById('score').innerHTML = 0;
    document.getElementById('start-button').value = 'End (ESC)';
    document.getElementById('start-button').onclick = stop;
    falling_coins.length = 0;
    frame_orange = 9;
    frame_purple = 0;
    key_left = false;
    key_right = false;
    player_x = 6;

    // Max time mode.
    if(settings_settings['game-mode'] == 1){
        document.getElementById('time').innerHTML = settings_settings['max'];
        document.getElementById('time-max').innerHTML = settings_settings['max'];
        document.getElementById('score-max').innerHTML = '';
        document.getElementById('time-max-span').style.display = settings_settings['max'] > 0
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
        document.getElementById('score-max').innerHTML = settings_settings['max'] > 0
          ? ' / ' + settings_settings['max']
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
        settings_settings['ms-per-coin-move'] > 0
          ? settings_settings['ms-per-coin-move']
          : 100
    );
    interval_player = window.setInterval(
        player_move,
        settings_settings['ms-per-coin-move'] > 0
          ? settings_settings['ms-per-coin-move']
          : 100
    );
}

function stop(){
    window.clearInterval(interval_coins);
    window.clearInterval(interval_player);
    window.clearInterval(interval_time);

    document.getElementById('start-button').onclick = start;
    document.getElementById('start-button').value = 'Start (' + settings_settings['start-key'] + ')';
}

function time_interval(mode){
    // Max time mode game over.
    if(mode === 1
      && parseFloat(document.getElementById('time').innerHTML) <= 0
      && settings_settings['max'] > 0){
        stop();
        return;

    // Max points mode game over.
    }else if(settings_settings['max'] > 0
      && parseInt(document.getElementById('score').innerHTML, 10) >= settings_settings['max']){
        stop();
        return;
    }

    // Handle time.
    document.getElementById('time').innerHTML =
      (parseFloat(document.getElementById('time').innerHTML) + ((settings_settings['game-mode'] == 1
        && settings_settings['max'] > 0)
        ? -.1
        : .1)
      ).toFixed(1);
}

var color_empty = 'rgb(42, 42, 42)';
var color_orange = 'rgb(190, 100, 0)';
var color_player = 'rgb(32, 102, 32)';
var color_purple = 'rgb(102, 51, 102)';
var falling_coins = [];
var frame_orange = 0;
var frame_purple = 0;
var interval_coins = 0;
var interval_player = 0;
var interval_time = 0;
var key_left = false;
var key_right = false;
var player_x = 6;

window.onload = function(){
    settings_init({
      'prefix': 'Dropdown.htm-',
      'settings': {
        'audio-volume': 1,
        'frames-per-purple': 9,
        'game-mode': 1,
        'max': 0,
        'movement-keys': 'AD',
        'ms-per-coin-move': 100,
        'ms-per-player-move': 100,
        'orange-miss': 1,
        'purple-catch': 1,
        'start-key': 'H',
        'wrap': 0,
        'y-margin': 0,
      },
    });
    audio_init({
      'volume': settings_settings['audio-volume'],
    });
    audio_create({
      'id': 'boop',
      'properties': {
        'duration': .1,
        'volume': .1,
      },
    });

    document.getElementById('settings').innerHTML =
      '<tr><td colspan=2><input id=reset-button onclick=settings_reset() type=button value=Reset>'
        + '<tr><td><input id=audio-volume max=1 min=0 step=0.01 type=range><td>Audio'
        + '<tr><td><input id=frames-per-purple><td>Frames/Purple_Coin'
        + '<tr><td><input id=max><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select>'
        + '<tr><td><input id=movement-keys maxlength=2><td>Move'
        + '<tr><td><input id=ms-per-coin-move><td>ms/Coin_Move'
        + '<tr><td><input id=ms-per-player-move><td>ms/Player_Move'
        + '<tr><td><select id=orange-miss><option value=0>Disappear</option><option selected value=1>End Game</option><option value=2>Score-1</option></select><td>Orange Coin Miss'
        + '<tr><td><select id=purple-catch><option value=0>End Game</option><option selected value=1>Score-1</option></select><td>Purple Coin Catch'
        + '<tr><td><input id=start-key maxlength=1><td>Start'
        + '<tr><td><select id=wrap><option value=0>—</option><option value=2>←</option><option value=3>→</option><option value=1>↔</option></select><td>Wrap'
        + '<tr><td><input id=y-margin><td>Y Margin';
    settings_update();

    // Set margin-top of game-div based on y-margin.
    document.getElementById('game-div').style.marginTop = settings_settings['y-margin'] + 'px';

    // Setup game div.
    var output = '';
    for(var loop_counter = 0; loop_counter < 208; loop_counter++){
        if(loop_counter % 13 === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        var color = loop_counter == 201
          ? color_player
          : color_empty;

        output +=
          '<input class=gridbutton disabled id=' + loop_counter
          + ' style="background:' + color
          + '" type=button>';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    stop();

    document.getElementById('settings-button').onclick = function(){
        settings_toggle();
    };
    document.getElementById('start-button').onclick = start;

    window.onkeydown = function(e){
        var key = e.keyCode || e.which;

        // ESC: stop current game.
        if(key === 27){
            stop();
            return;

        // +: show settings.
        }else if(key === 187){
            settings_toggle(true);
            return;

        // -: hide settings.
        }else if(key === 189){
            settings_toggle(false);
            return;
        }

        key = String.fromCharCode(key);

        if(key === settings_settings['movement-keys'][0]){
            key_left = true;

        }else if(key === settings_settings['movement-keys'][1]){
            key_right = true;

        }else if(key === settings_settings['start-key']){
            stop();
            start();
        }
    };

    window.onkeyup = function(e){
        var key = String.fromCharCode(e.keyCode || e.which);

        if(key === settings_settings['movement-keys'][0]){
            key_left = false;

        }else if(key === settings_settings['movement-keys'][1]){
            key_right = false;
        }
    };
};
