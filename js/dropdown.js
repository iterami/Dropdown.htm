function coin_fall(){
    for(var coin in falling_coins){
        // If coin is not at the bottom of the game area.
        if(falling_coins[coin][1] < 15){
            // If coin is at a y position to be caught and it is directly above the player.
            if(falling_coins[coin][1] === 14
              && document.getElementById(195 + falling_coins[coin][0]).style.backgroundColor === color_player){
                // Set button color to empty.
                document.getElementById(182 + falling_coins[coin][0]).style.backgroundColor = color_empty;

                // If it is a purple coins and catching purple coins ends the game, end the game.
                if(falling_coins[coin][2] < 0
                  && document.getElementById('purple-catch-select').value == 0){
                    stop();

                // Else adjust the score by the point value of the coin.
                }else{
                    document.getElementById('score').innerHTML =
                      parseInt(
                        document.getElementById('score').innerHTML,
                        10
                      ) + falling_coins[coin][2];

                    // Remove the coin.
                    falling_coins.splice(coin, 1);

                    // Restart coin_fall function.
                    coin_fall();
                    return;
                }
            }

            // Update coin Y value.
            var id = falling_coins[coin][0] + 13 * falling_coins[coin][1];
            document.getElementById(id).style.backgroundColor = color_empty;
            falling_coins[coin][1] += 1;

            // Draw coin at new Y position.
            id = falling_coins[coin][0] + 13 * falling_coins[coin][1];
            document.getElementById(id).style.backgroundColor = (falling_coins[coin][2] === 1)
              ? color_orange
              : color_purple;

        }else{
            // If it is an orange coin.
            if(falling_coins[coin][2] === 1){
                // If missing an orange coin causes game to end, end the game.
                if(document.getElementById('orange-miss-select').value == 1){
                    stop();

                }else{
                    // If missing an orange coin decreases score, decrease score.
                    if(document.getElementById('orange-miss-select').value == 2){
                        document.getElementById('score').innerHTML =
                          parseInt(document.getElementById('score').innerHTML, 10) - 1;
                    }

                    // Delete orange coin.
                    var id = falling_coins[coin][0] + 13 * falling_coins[coin][1];
                    document.getElementById(id).style.backgroundColor = color_empty;
                    falling_coins.splice(coin, 1);

                    // Restart function.
                    coin_fall();
                }

            }else{
                // Delete and ignore purple coin.
                var id = falling_coins[coin][0] + 13 * falling_coins[coin][1];
                document.getElementById(id).style.backgroundColor = color_empty;
                falling_coins.splice(coin, 1);

                // Restart function.
                coin_fall();
            }
            return;
        }
    }

    var new_purple_x = -1;

    // If there are purple buttons and it is time to add one...
    if(document.getElementById('frames-per-purple').value > 0
      && frame_purple === parseInt(document.getElementById('frames-per-purple').value - 1)){
        new_purple_x = Math.floor(Math.random() * 13);

        falling_coins.push([
          new_purple_x,// X
          0,// Y
          -1,// Point value
        ]);

        document.getElementById(new_purple_x).style.backgroundColor = color_purple;
        frame_purple = -1;
    }

    // If it is time to add an orange button...
    if(frame_orange === 9){
        var new_orange_x = new_purple_x;
        do{
            new_orange_x = Math.floor(Math.random() * 13);
        }while(new_orange_x === new_purple_x);

        falling_coins.push([
          new_orange_x,// X
          0,// Y
          1,// Point value
        ]);

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

        // Check if player can wrap around left side of game area.
        }else if(document.getElementById('wrap-select').value == 1
          || document.getElementById('wrap-select').value == 2){
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

        // Check if player can wrap around right side of game area.
        }else if(document.getElementById('wrap-select').value == 1
          || document.getElementById('wrap-select').value == 3){
            // Set current player button to empty color.
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // Update player position.
            player_x = 0;

            // Set new player button to player color.
            document.getElementById(195 + player_x).style.backgroundColor = color_player;
        }
    }
}

function play_audio(i){
    if(document.getElementById('audio-volume').value <= 0){
        return;
    }

    document.getElementById(i).volume = document.getElementById('audio-volume').value;
    document.getElementById(i).currentTime = 0;
    document.getElementById(i).play();
}

function reset(){
    if(!confirm('Reset settings?')){
        return;
    }

    stop();

    document.getElementById('audio-volume').value = 1;
    document.getElementById('frames-per-purple').value = 9;
    document.getElementById('game-mode-select').value = 1;
    document.getElementById('max-points').value = 50;
    document.getElementById('max-time').value = 0;
    document.getElementById('move-keys').value = 'AD';
    document.getElementById('ms-per-coin-move').value = 100;
    document.getElementById('ms-per-player-move').value = 100;
    document.getElementById('orange-miss-select').value = 1;
    document.getElementById('purple-catch-select').value = 1;
    document.getElementById('score').value = 0;
    document.getElementById('start-key').value = 'H';
    document.getElementById('wrap-select').value = 0;
    document.getElementById('y-margin').value = 0;

    save();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'frames-per-purple': 9,
      'game-mode-select': 1,
      'max-points': 50,
      'max-time': 0,
      'move-keys': 'AD',
      'ms-per-coin-move': 100,
      'ms-per-player-move': 100,
      'orange-miss-select': 1,
      'purple-catch-select': 1,
      'start-key': 'H',
      'wrap-select': 0,
      'y-margin': 0,
    };
    for(var id in ids){
        if(document.getElementById(id).value == ids[id]){
            window.localStorage.removeItem('Dropdown.htm-' + id);

        }else{
            window.localStorage.setItem(
              'Dropdown.htm-' + id,
              document.getElementById(id).value
            );
        }
    }
}

function set_settings_disable(state){
    document.getElementById('frames-per-purple').disabled = state;
    document.getElementById('game-mode-select').disabled = state;
    document.getElementById('max-points').disabled = state;
    document.getElementById('max-time').disabled = state;
    document.getElementById('ms-per-coin-move').disabled = state;
    document.getElementById('ms-per-player-move').disabled = state;
    document.getElementById('orange-miss-select').disabled = state;
    document.getElementById('purple-catch-select').disabled = state;
    document.getElementById('reset-button').disabled = state;
    document.getElementById('wrap-select').disabled = state;
}

function settings_toggle(){
    if(document.getElementById('settings-button').value === '-'){
        document.getElementById('settings-span').style.display = 'none';
        document.getElementById('settings-button').value = '+';

    }else{
        document.getElementById('settings-span').style.display = 'inline';
        document.getElementById('settings-button').value = '-';
    }
}

function start(){
    // Validate settings.
    var ids = {
      'audio-volume': 1,
      'frames-per-purple': 9,
      'max-points': 50,
      'max-time': 0,
      'ms-per-coin-move': 100,
      'ms-per-player-move': 100,
      'y-margin': 0,
    };
    for(var id in ids){
        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value < 0){
            document.getElementById(id).value = ids[id];
        }
    }

    // Set margin-top of table based on y-margin.
    document.getElementById('table').style.marginTop = document.getElementById('y-margin').value + 'px';

    // Reset colors of buttons.
    var loop_counter = 207;
    do{
        document.getElementById(loop_counter).style.backgroundColor = color_empty;
    }while(loop_counter--);
    document.getElementById(201).style.backgroundColor = color_player;

    document.getElementById('start-button').value = 'End (ESC)';
    document.getElementById('start-button').onclick = function(){
        stop();
    };
    set_settings_disable(true);
    falling_coins.length = 0;
    frame_orange = 9;
    frame_purple = 0;
    key_left = false;
    key_right = false;
    document.getElementById('score').innerHTML = 0;
    player_x = 6;

    // Max time mode.
    if(document.getElementById('game-mode-select').value == 1){
        document.getElementById('time').innerHTML = document.getElementById('max-time').value;
        document.getElementById('time-max').innerHTML = document.getElementById('max-time').value;
        document.getElementById('score-max').innerHTML = '';
        document.getElementById('time-max-span').style.display = document.getElementById('max-time').value > 0
          ? 'inline'
          : 'none';
        interval_time = window.setInterval(
          'time_interval(1)',
          100
        );

    // Max points mode.
    }else{
        document.getElementById('time').innerHTML = 0;
        document.getElementById('time-max-span').style.display = 'none';
        document.getElementById('score-max').innerHTML = document.getElementById('max-points').value > 0
          ? ' out of <b>' + document.getElementById('max-points').value + '</b>'
          : '';
        interval_time = window.setInterval('time_interval(0)', 100);
    }

    interval_coins = window.setInterval(
        'coin_fall()',
        document.getElementById('ms-per-coin-move').value > 0
          ? document.getElementById('ms-per-coin-move').value
          : 100
    );
    interval_player = window.setInterval(
        'player_move()',
        document.getElementById('ms-per-player-move').value > 0
          ? document.getElementById('ms-per-player-move').value
          : 100
    );

    save();
}

function stop(){
    window.clearInterval(interval_coins);
    window.clearInterval(interval_time);
    window.clearInterval(interval_player);

    set_settings_disable(false);

    document.getElementById('start-button').onclick = function(){
        start();
    };
    document.getElementById('start-button').value = 'Start (' + document.getElementById('start-key').value + ')';
}

function time_interval(mode){
    if(mode){
        // Max time mode game over.
        if(parseFloat(document.getElementById('time').innerHTML) <= 0
          && document.getElementById('max-time').value > 0){
            stop();

        // Increase time.
        }else{
            document.getElementById('time').innerHTML = (
              (
                parseFloat(document.getElementById('time').innerHTML) + ((document.getElementById('game-mode-select').value == 1
                && document.getElementById('max-time').value > 0)
                  ? -.1
                  : .1)
              ).toFixed(1)
            );
        }

    // Max points mode game over.
    }else if(document.getElementById('max-points').value > 0
      && parseInt(document.getElementById('score').innerHTML) >= document.getElementById('max-points').value){
        stop();

    // Increase time.
    }else{
        document.getElementById('time').innerHTML = (
         (parseFloat(document.getElementById('time').innerHTML) + ((document.getElementById('game-mode-select').value == 1
         && document.getElementById('max-time').value > 0)
           ? -.1
           : .1)
         ).toFixed(1));
    }
}

var color_empty = 'rgb(42, 42, 42)';
var color_player = 'rgb(32, 102, 32)';
var color_orange = 'rgb(190, 100, 0)';
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

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // ESC: stop current game.
    if(key === 27){
        stop();
        return;
    }

    key = String.fromCharCode(key);

    if(key === document.getElementById('move-keys').value[0]){
        key_left = true;

    }else if(key === document.getElementById('move-keys').value[1]){
        key_right = true;

    }else if(key === document.getElementById('start-key').value){
        stop();
        start();
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === document.getElementById('move-keys').value[0]){
        key_left = false;

    }else if(key === document.getElementById('move-keys').value[1]){
        key_right = false;
    }
};

window.onload = function(){
    // Fetch settings from window.localStorage and update settings inputs.
    var ids = {
      'frames-per-purple': 9,
      'max-points': 50,
      'max-time': 0,
      'ms-per-coin-move': 100,
      'ms-per-player-move': 100,
      'orange-miss-select': 1,
      'wrap-select': 0,
      'y-margin': 0,
    };
    for(var id in ids){
        document.getElementById(id).value =
          window.localStorage.getItem('Dropdown.htm-' + id) === null
            ? ids[id]
            : parseInt(window.localStorage.getItem('Dropdown.htm-' + id));
    }

    document.getElementById('audio-volume').value =
      window.localStorage.getItem('Dropdown.htm-audio-volume') === null
        ? 1
        : parseFloat(window.localStorage.getItem('Dropdown.htm-audio-volume'));
    document.getElementById('purple-catch-select').value =
      window.localStorage.getItem('Dropdown.htm-purple-catch-select') === null
        ? 1
        : 0;
    document.getElementById('game-mode-select').value =
      window.localStorage.getItem('Dropdown.htm-game-mode-select') === null
        ? 1
        : 0;
    document.getElementById('move-keys').value =
      window.localStorage.getItem('Dropdown.htm-move-keys') === null
        ? 'AD'
        : window.localStorage.getItem('Dropdown.htm-move-keys');

    if(window.localStorage.getItem('Dropdown.htm-start-key') === null){
        document.getElementById('start-key').value = 'H';

    }else{
        document.getElementById('start-key').value =
          window.localStorage.getItem('Dropdown.htm-start-key');
        document.getElementById('start-button').value =
          'Start (' + window.localStorage.getItem('Dropdown.htm-start-key') + ')';
    }
  
    // Set margin-top of table based on y-margin.
    document.getElementById('table').style.marginTop = document.getElementById('y-margin').value + 'px';

    // Setup game area.
    var output = [''];

    for(var i = 0; i < 208; i++){
        if(i % 13 === 0
          && i !== 0){
            output.push('<br>');
        }
        output.push('<input class=buttons disabled id=' + i + ' style="background:' + color_empty + '" type=button>');
    }
    output[217] = '<input class=buttons disabled id=201 style="background:' + color_player + '" type=button>';
    document.getElementById('game-area').innerHTML = output.join('');
};
