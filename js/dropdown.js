function coin_fall(){
    j = falling_coins.length;
    for(i = 0; i < j; i++){
        // if coin is not at the bottom of the game area
        if(falling_coins[i][1] < 15){
            // if coin is at a y position to be caught and it is directly above the player
            if(falling_coins[i][1] === 14
              && document.getElementById(195 + falling_coins[i][0]).style.backgroundColor === color_player){
                // set button color to empty
                document.getElementById(182 + falling_coins[i][0]).style.backgroundColor = color_empty;

                // if it is a purple coins and catching purple coins ends the game, end the game
                if(falling_coins[i][2] < 0
                  && document.getElementById('purple-catch-select').value == 0){
                    stop();

                }else{
                    // else adjust the score by the point value of the coin
                    document.getElementById('score').innerHTML =
                      parseInt(
                        document.getElementById('score').innerHTML,
                        10
                      ) + falling_coins[i][2];

                    // remove the coin
                    falling_coins.splice(i, 1);

                    // restart coin_fall function
                    coin_fall();
                    return;
                }
            }

            // update coin y value and draw it in its new position
            document.getElementById(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = color_empty;
            falling_coins[i][1] += 1;
            document.getElementById(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = (falling_coins[i][2] === 1)
              ? color_orange
              : color_purple;

        }else{
            // if it is an orange coin
            if(falling_coins[i][2] === 1){
                // if missing an orange coin causes game to end, end the game
                if(document.getElementById('orange-miss-select').value == 1){
                    stop();

                }else{
                    // if missing an orange coin decreases score, decrease score
                    if(document.getElementById('orange-miss-select').value == 2){
                        document.getElementById('score').innerHTML =
                          parseInt(document.getElementById('score').innerHTML, 10) - 1;
                    }

                    // delete orange coin
                    document.getElementById(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = color_empty;
                    falling_coins.splice(i, 1);

                    // restart function
                    coin_fall();
                }

            }else{
                // delete and ignore purple coin
                document.getElementById(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = color_empty;
                falling_coins.splice(i, 1);

                // restart function
                coin_fall();
            }
            return;
        }
    }

    var temp_newpurppos = -1;
    var temp_neworangepos = -1;

    // if there are purple buttons and it is time to add one
    if(document.getElementById('frames-per-purple').value > 0
      && frame_purple === parseInt(document.getElementById('frames-per-purple').value - 1)){
        temp_newpurppos = Math.floor(Math.random() * 13);

        falling_coins.push([
          temp_newpurppos,// x
          0,// y
          -1// point value
        ]);

        document.getElementById(temp_newpurppos).style.backgroundColor = color_purple;
        frame_purple = -1;
    }

    // if it is time to add an orange button
    if(frame_orange === 9){
        do{
            temp_neworangepos = Math.floor(Math.random() * 13);
        }while(temp_neworangepos === temp_newpurppos);

        falling_coins.push([
          temp_neworangepos,// x
          0,// y
          1// point value
        ]);

        document.getElementById(temp_neworangepos).style.backgroundColor = color_orange;
        frame_orange = -1;
    }

    // increase frame counters
    frame_orange += 1;
    frame_purple += 1;

    // draw player button just in case it was overwritten
    document.getElementById(195 + player_x).style.backgroundColor = color_player;
}

function init(){
    // fetch settings from localStorage if they exist, and update settings inputs with defaults or localStorage values
    document.getElementById('audio-volume').value =
      window.localStorage.getItem('Dropdown.htm-audio-volume') === null
        ? 1
        : parseFloat(window.localStorage.getItem('Dropdown.htm-audio-volume'));
    document.getElementById('purple-catch-select').value =
      window.localStorage.getItem('Dropdown.htm-purple-catch-select') === null
        ? 1
        : 0;
    document.getElementById('frames-per-purple').value =
      window.localStorage.getItem('Dropdown.htm-frames-per-purple') === null
        ? 9
        : parseInt(window.localStorage.getItem('Dropdown.htm-frames-per-purple'));
    document.getElementById('game-mode-select').value =
      window.localStorage.getItem('Dropdown.htm-game-mode-select') === null
        ? 1
        : 0;
    document.getElementById('max-points').value =
      window.localStorage.getItem('Dropdown.htm-max-points') === null
        ? 50
        : parseInt(window.localStorage.getItem('Dropdown.htm-max-points'));
    document.getElementById('max-time').value =
      window.localStorage.getItem('Dropdown.htm-max-time') === null
        ? 0
        : parseInt(window.localStorage.getItem('Dropdown.htm-max-time'));
    document.getElementById('move-keys').value =
      window.localStorage.getItem('Dropdown.htm-move-keys') === null
        ? 'AD'
        : window.localStorage.getItem('Dropdown.htm-move-keys');
    document.getElementById('ms-per-coin-move').value =
      window.localStorage.getItem('Dropdown.htm-ms-per-coin-move') === null
        ? 100
        : parseInt(window.localStorage.getItem('Dropdown.htm-ms-per-coin-move'));
    document.getElementById('ms-per-player-move').value =
      window.localStorage.getItem('Dropdown.htm-ms-per-player-move') === null
        ? 100
        : parseInt(window.localStorage.getItem('Dropdown.htm-ms-per-player-move'));
    document.getElementById('orange-miss-select').value =
      window.localStorage.getItem('Dropdown.htm-orange-miss-select') === null
        ? 1
        : parseInt(window.localStorage.getItem('Dropdown.htm-orange-miss-select'));

    if(window.localStorage.getItem('Dropdown.htm-start-key') === null){
        document.getElementById('start-key').value = 'H';

    }else{
        document.getElementById('start-key').value =
          window.localStorage.getItem('Dropdown.htm-start-key');
        document.getElementById('start-button').value =
          'Start (' + window.localStorage.getItem('Dropdown.htm-start-key') + ')';
    }

    document.getElementById('wrap-select').value =
      window.localStorage.getItem('Dropdown.htm-wrap-select') === null
        ? 0
        : parseInt(window.localStorage.getItem('Dropdown.htm-wrap-select'));
    document.getElementById('y-margin').value =
      window.localStorage.getItem('Dropdown.htm-y-margin') === null
        ? 0
        : parseInt(window.localStorage.getItem('Dropdown.htm-y-margin'));
  
    // setup game margin-top
    document.getElementById('lol-a-table').style.marginTop = document.getElementById('y-margin').value + 'px';

    // setup game area
    var output = [''];

    for(i = 0; i < 208; i++){
        if(i % 13 === 0
          && i !== 0){
            output.push('<br>');
        }
        output.push('<input class=buttons disabled id=' + i + ' style="background:' + color_empty + '" type=button>');
    }
    output[217] = '<input class=buttons disabled id=201 style="background:' + color_player + '" type=button>';
    document.getElementById('game-area').innerHTML = output.join('');
}

function player_move(){
    if(key_left){
        if(player_x > 0){
            // set current player button to empty color
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // update player position
            player_x -= 1;

            // set new player button to player color
            document.getElementById(195 + player_x).style.backgroundColor = color_player;

        // check if player can wrap around left side of game area
        }else if(document.getElementById('wrap-select').value == 1
          || document.getElementById('wrap-select').value == 2){
            // set current player button to empty color
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // update player position
            player_x = 12;

            // set new player button to player color
            document.getElementById(195 + player_x).style.backgroundColor = color_player;
        }

    }else if(key_right){
        if(player_x < 12){
            // set current player button to empty color
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // update player position
            player_x += 1;

            // set new player button to player color
            document.getElementById(195 + player_x).style.backgroundColor = color_player;

        // check if player can wrap around right side of game area
        }else if(document.getElementById('wrap-select').value == 1
          || document.getElementById('wrap-select').value == 3){
            // set current player button to empty color
            document.getElementById(195 + player_x).style.backgroundColor = color_empty;

            // update player position
            player_x = 0;

            // set new player button to player color
            document.getElementById(195 + player_x).style.backgroundColor = color_player;
        }
    }
}

function play_audio(i){
    if(document.getElementById('audio-volume').value > 0){
        document.getElementById(i).volume = document.getElementById('audio-volume').value;
        document.getElementById(i).currentTime = 0;
        document.getElementById(i).play();
    }
}

function reset(){
    if(confirm('Reset settings?')){
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
}

function save(){
    // save settings in localStorage if they differ from default
    var loop_counter = 12;
    do{
        var id = [
          'ms-per-coin-move',
          'ms-per-player-move',
          'frames-per-purple',
          'orange-miss-select',
          'audio-volume',
          'max-time',
          'wrap-select',
          'y-margin',
          'game-mode-select',
          'max-points',
          'purple-catch-select',
          'move-keys',
          'start-key'
        ][loop_counter];

        if(document.getElementById(id).value == [100, 100, 9, 1, 1, 0, 0, 0, 1, 50, 1, 'AD', 'H'][loop_counter]){
            window.localStorage.removeItem('Dropdown.htm-' + id);

        }else{
            window.localStorage.setItem(
              'Dropdown.htm-' + id,
              document.getElementById(id).value
            );
        }
    }while(loop_counter--);
}

function set_settings_disable(i){
    // i==1 settings disabled, i==0 settings enabled
    document.getElementById('frames-per-purple').disabled = i;
    document.getElementById('game-mode-select').disabled = i;
    document.getElementById('max-points').disabled = i;
    document.getElementById('max-time').disabled = i;
    document.getElementById('ms-per-coin-move').disabled = i;
    document.getElementById('ms-per-player-move').disabled = i;
    document.getElementById('orange-miss-select').disabled = i;
    document.getElementById('purple-catch-select').disabled = i;
    document.getElementById('reset-button').disabled = i;
    document.getElementById('wrap-select').disabled = i;
}

function showhide_hack(){
    document.getElementById('hack-span').style.display = document.getElementById('hack-span').style.display === 'none'
      ? 'inline'
      : 'none';
}

function showhide_settings(){
    i = document.getElementById('showhide-button').value === '-' ? 1 : 0;
    document.getElementById('settings-span').style.display = ['inline', 'none'][i];
    document.getElementById('showhide-button').value = ['-', '+'][i];
}

function start(){
    // validate settings
    if(isNaN(document.getElementById('audio-volume').value)){
        document.getElementById('audio-volume').value = 1;
    }
    if(isNaN(document.getElementById('frames-per-purple').value)){
        document.getElementById('frames-per-purple').value = 9;
    }
    if(isNaN(document.getElementById('max-points').value)){
        document.getElementById('max-points').value = 50;
    }
    if(isNaN(document.getElementById('max-time').value)){
        document.getElementById('max-time').value = 0;
    }
    if(isNaN(document.getElementById('ms-per-coin-move').value)){
        document.getElementById('ms-per-coin-move').value = 100;
    }
    if(isNaN(document.getElementById('ms-per-player-move').value)){
        document.getElementById('ms-per-player-move').value = 100;
    }

    // setup margin-top of game
    document.getElementById('y-margin').value = 0;
    document.getElementById('lol-a-table').style.marginTop = document.getElementById('y-margin').value + 'px';

    // reset colors of buttons
    i = 207;
    do{
        document.getElementById(i).style.backgroundColor = color_empty;
    }while(i--);
    document.getElementById(201).style.backgroundColor = color_player;

    document.getElementById('start-button').value = 'End (ESC)';
    document.getElementById('start-button').onclick = function(){
        stop();
    };
    set_settings_disable(1);
    falling_coins.length = 0;
    frame_orange = 9;
    frame_purple = 0;
    key_left = 0;
    key_right = 0;
    document.getElementById('score').innerHTML = 0;
    player_x = 6;

    // max time mode
    if(document.getElementById('game-mode-select').value == 1){
        document.getElementById('time').innerHTML = document.getElementById('max-time').value;
        document.getElementById('time-max').innerHTML = document.getElementById('max-time').value;
        document.getElementById('score-max').innerHTML = '';
        document.getElementById('time-max-span').style.display = document.getElementById('max-time').value > 0
          ? 'inline'
          : 'none';
        interval_time = setInterval(
          'time_interval(1)',
          100
        );

    // max points mode
    }else{
        document.getElementById('time').innerHTML = 0;
        document.getElementById('time-max-span').style.display = 'none';
        document.getElementById('score-max').innerHTML = document.getElementById('max-points').value > 0
          ? ' out of <b>' + document.getElementById('max-points').value + '</b>'
          : '';
        interval_time = setInterval('time_interval(0)', 100);
    }

    interval_coins = setInterval(
        'coin_fall()',
        document.getElementById('ms-per-coin-move').value > 0
          ? document.getElementById('ms-per-coin-move').value
          : 100
    );
    interval_player = setInterval(
        'player_move()',
        document.getElementById('ms-per-player-move').value > 0
          ? document.getElementById('ms-per-player-move').value
          : 100
    );

    save();
}

function stop(){
    clearInterval(interval_coins);
    clearInterval(interval_time);
    clearInterval(interval_player);

    set_settings_disable(0);

    document.getElementById('start-button').onclick = function(){
        start();
    };
    document.getElementById('start-button').value = 'Start (' + document.getElementById('start-key').value + ')';
}

function time_interval(mode){
    if(mode){
        // max time mode game over*/
        if(parseFloat(document.getElementById('time').innerHTML) <= 0
          && document.getElementById('max-time').value > 0){
            stop();

        // increase time
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

    // max points mode game over
    }else if(document.getElementById('max-points').value > 0
      && parseInt(document.getElementById('score').innerHTML) >= document.getElementById('max-points').value){
        stop();

    // increase time
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
var i = 0;
var interval_coins = 0;
var interval_player = 0;
var interval_time = 0;
var j = [''];
var key_left = 0;
var key_right = 0;
var player_x = 6;

window.onkeydown = function(e){
    var key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    if(String.fromCharCode(key) === document.getElementById('move-keys').value[0]){// left move key
        key_left = 1;

    }else if(String.fromCharCode(key) === document.getElementById('move-keys').value[1]){// right move key
        key_right = 1;

    }else if(String.fromCharCode(key) === document.getElementById('start-key').value){
        stop();
        start();

    }else if(key === 27){// ESC
        stop();
    }
};

window.onkeyup = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key === document.getElementById('move-keys').value[0]){
        key_left = 0;

    }else if(key === document.getElementById('move-keys').value[1]){
        key_right = 0;
    }
};

window.onload = init;
