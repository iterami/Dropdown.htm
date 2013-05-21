function coin_fall(){
    j = falling_coins.length;
    for(i = 0; i < j; i++){
        /*if coin is not at the bottom of the game area*/
        if(falling_coins[i][1] < 15){
            /*if coin is at a y position to be caught and it is directly above the player*/
            if(falling_coins[i][1] === 14 && get(195 + falling_coins[i][0]).style.backgroundColor === color_player){
                /*set button color to empty*/
                get(182 + falling_coins[i][0]).style.backgroundColor=color_empty;

                /*if it is a purple coins and catching purple coins ends the game, end the game*/
                if(falling_coins[i][2] < 0 && get('purple-catch-select').value == 0){
                    stop()
                }else{
                    /*else adjust the score by the point value of the coin*/
                    get('score').innerHTML = parseInt(get('score').innerHTML,10) + falling_coins[i][2];

                    /*remove the coin*/
                    falling_coins.splice(i,1);

                    /*restart coin_fall function*/
                    coin_fall();
                    return
                }
            }

            /*update coin y value and draw it in its new position*/
            get(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = color_empty;
            falling_coins[i][1] += 1;
            get(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = (falling_coins[i][2] === 1) ? color_orange : color_purple
        }else{
            /*if it is an orange coin*/
            if(falling_coins[i][2] === 1){
                /*if missing an orange coin causes game to end, end the game*/
                if(get('orange-miss-select').value == 1){
                    stop()
                }else{
                    /*if missing an orange coin decreases score, decrease score*/
                    if(get('orange-miss-select').value == 2){
                        get('score').innerHTML = parseInt(get('score').innerHTML,10) - 1
                    }

                    /*delete orange coin*/
                    get(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = color_empty;
                    falling_coins.splice(i,1);

                    /*restart function*/
                    coin_fall()
                }
            }else{
                /*delete and ignore purple coin*/
                get(falling_coins[i][0] + 13 * falling_coins[i][1]).style.backgroundColor = color_empty;
                falling_coins.splice(i,1);

                /*restart function*/
                coin_fall()
            }
            return
        }
    }

    var temp_newpurppos=-1;
    var temp_neworangepos=-1;

    /*if there are purple buttons and it is time to add one*/
    if(get('frames-per-purple').value > 0 && frame_purple === parseInt(get('frames-per-purple').value - 1)){
        temp_newpurppos = Math.floor(Math.random() * 13);
        falling_coins.push([
            temp_newpurppos,/*x*/
            0,/*y*/
            -1/*point value*/
        ]);
        get(temp_newpurppos).style.backgroundColor = color_purple;
        frame_purple = -1
    }

    /*if it is time to add an orange button*/
    if(frame_orange === 9){
        do{
            temp_neworangepos = Math.floor(Math.random() * 13)
        }while(temp_neworangepos === temp_newpurppos);
        falling_coins.push([
            temp_neworangepos,/*x*/
            0,/*y*/
            1/*point value*/
        ]);
        get(temp_neworangepos).style.backgroundColor = color_orange;
        frame_orange = -1
    }

    /*increase frame counters*/
    frame_orange += 1;
    frame_purple += 1;

    /*draw player button just in case it was overwritten*/
    get(195 + player_x).style.backgroundColor = color_player
}

function player_move(){
    if(key_left){
        if(player_x > 0){
            /*set current player button to empty color*/
            get(195 + player_x).style.backgroundColor = color_empty;

            /*update player position*/
            player_x -= 1;

            /*set new player button to player color*/
            get(195 + player_x).style.backgroundColor = color_player

        /*check if player can wrap around left side of game area*/
        }else if(get('wrap-select').value == 1 || get('wrap-select').value == 2){
            /*set current player button to empty color*/
            get(195 + player_x).style.backgroundColor = color_empty;

            /*update player position*/
            player_x = 12;

            /*set new player button to player color*/
            get(195 + player_x).style.backgroundColor = color_player
        }
    }else if(key_right){
        if(player_x < 12){
            /*set current player button to empty color*/
            get(195 + player_x).style.backgroundColor = color_empty;

            /*update player position*/
            player_x += 1;

            /*set new player button to player color*/
            get(195 + player_x).style.backgroundColor = color_player

        /*check if player can wrap around right side of game area*/
        }else if(get('wrap-select').value == 1 || get('wrap-select').value == 3){
            /*set current player button to empty color*/
            get(195 + player_x).style.backgroundColor = color_empty;

            /*update player position*/
            player_x = 0;

            /*set new player button to player color*/
            get(195+player_x).style.backgroundColor = color_player
        }
    }
}

function get(i){
    return document.getElementById(i)
}

function play_audio(i){
    if(get('audio-volume').value > 0){
        get(i).volume = get('audio-volume').value;
        get(i).currentTime = 0;
        get(i).play()
    }
}

function reset(){
    if(confirm('Reset settings?')){
        stop();
        get('audio-volume').value = 1;
        get('frames-per-purple').value = 9;
        get('game-mode-select').value = 1;
        get('max-points').value = 50;
        get('max-time').value = 0;
        get('move-keys').value = 'AD';
        get('ms-per-coin-move').value = 100;
        get('ms-per-player-move').value = 100;
        get('orange-miss-select').value = 1;
        get('purple-catch-select').value = 1;
        get('score').value = 0;
        get('start-key').value = 'H';
        get('wrap-select').value = 0;
        get('y-margin').value = 0;
        save()
    }
}

function save(){
    /*save settings in localStorage if they differ from default*/
    i = 12;
    j = [
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
    ];
    do{
        if(get(j[i]).value == [100,100,9,1,1,0,0,0,1,50,1,'AD','H'][i]){
            ls.removeItem('dropdown' + i)
        }else{
            ls.setItem('dropdown' + i,get(j[i]).value)
        }
    }while(i--);
    j = 0
}

function set_settings_disable(i){
    /*i==1 settings disabled, i==0 settings enabled*/
    get('frames-per-purple').disabled = i;
    get('game-mode-select').disabled = i;
    get('max-points').disabled = i;
    get('max-time').disabled = i;
    get('ms-per-coin-move').disabled = i;
    get('ms-per-player-move').disabled = i;
    get('orange-miss-select').disabled = i;
    get('purple-catch-select').disabled = i;
    get('reset-button').disabled = i;
    get('wrap-select').disabled = i
}

function showhide_hack(){
    get('hack-span').style.display = get('hack-span').style.display === 'none' ? 'inline' : 'none'
}

function showhide_settings(){
    i = get('showhide-button').value === '-' ? 1 : 0;
    get('settings-span').style.display = ['inline','none'][i];
    get('showhide-button').value = ['-','+'][i]
}

function start(){
    /*validate settings*/
    if(isNaN(get('audio-volume').value)){
        get('audio-volume').value = 1
    }
    if(isNaN(get('frames-per-purple').value)){
        get('frames-per-purple').value = 9
    }
    if(isNaN(get('max-points').value)){
        get('max-points').value = 50
    }
    if(isNaN(get('max-time').value)){
        get('max-time').value = 0
    }
    if(isNaN(get('ms-per-coin-move').value)){
        get('ms-per-coin-move').value = 100
    }
    if(isNaN(get('ms-per-player-move').value)){
        get('ms-per-player-move').value = 100
    }

    /*setup margin-top of game*/
    get('y-margin').value = 0;
    get('lol-a-table').style.marginTop = get('y-margin').value + 'px';

    /*reset colors of buttons*/
    i = 207;
    do{
        get(i).style.backgroundColor = color_empty
    }while(i--);
    get(201).style.backgroundColor = color_player;

    get('start-button').value = 'End (ESC)';
    get('start-button').onclick = function(){stop()};
    set_settings_disable(1);
    falling_coins = [];
    frame_orange = 9;
    frame_purple = 0;
    key_left = 0;
    key_right = 0;
    get('score').innerHTML = 0;
    player_x = 6;

    /*max time mode*/
    if(get('game-mode-select').value==1){
        get('time').innerHTML = get('time-max').innerHTML = get('max-time').value;
        get('score-max').innerHTML = '';
        get('time-max-span').style.display = get('max-time').value > 0?'inline':'none';
        interval_time = setInterval('time_interval(1)',100)

    /*max points mode*/
    }else{
        get('time').innerHTML = 0;
        get('time-max-span').style.display = 'none';
        get('score-max').innerHTML = get('max-points').value > 0 ? ' out of <b>'+get('max-points').value+'</b>' : '';
        interval_time = setInterval('time_interval(0)',100)
    }

    interval_coins=setInterval('coin_fall()',(get('ms-per-coin-move').value > 0) ? get('ms-per-coin-move').value : 100);
    interval_player=setInterval('player_move()',(get('ms-per-player-move').value > 0) ? get('ms-per-player-move').value : 100);
    save()
}

function stop(){
    clearInterval(interval_coins);
    clearInterval(interval_time);
    clearInterval(interval_player);

    set_settings_disable(0);

    get('start-button').onclick = function(){start()};
    get('start-button').value = 'Start (' + get('start-key').value + ')'
}

function time_interval(mode){
    /*max time mode*/
    if(mode){
        if(parseFloat(get('time').innerHTML) <= 0 && get('max-time').value > 0){
            stop()
        }else{
            get('time').innerHTML = ((parseFloat(get('time').innerHTML) + ((get('game-mode-select').value == 1 &&
                get('max-time').value > 0) ? -.1 : .1)).toFixed(1))
        }

    /*max points mode*/
    }else{
        if(get('max-points').value > 0 && parseInt(get('score').innerHTML) >= get('max-points').value){
            stop()
        }else{
            get('time').innerHTML = ((parseFloat(get('time').innerHTML) + ((get('game-mode-select').value == 1 &&
                get('max-time').value > 0) ? -.1 : .1)).toFixed(1))
        }
    }
}

var color_empty = 'rgb(99, 99, 99)';
var color_player = 'rgb(0, 225, 0)';
var color_orange = 'rgb(255, 155, 0)';
var color_purple = 'rgb(225, 0, 225)';
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
var ls = window.localStorage;
var player_x = 6;

/*setup game area*/
for(i = 0; i < 208; i++){
    if(i % 13 === 0 && i !== 0){
        j.push('<br>')
    }
    j.push('<input class=buttons disabled id=' + i + ' style="background:' + color_empty + '" type=button>')
}
j[217] = '<input class=buttons disabled id=201 style="background:' + color_player + '" type=button>';
get('game-area').innerHTML = j.join('');
j = 0;

/*fetch settings from localStorage if they exist, and update settings inputs with defaults or localStorage values*/
get('game-mode-select').value = ls.getItem('dropdown8') === null ? 1 : 0;
get('move-keys').value = ls.getItem('dropdown11') === null ? 'AD' : ls.getItem('dropdown11');
if(ls.getItem('dropdown12') === null){
    get('start-key').value = 'H'
}else{
    get('start-key').value = ls.getItem('dropdown12');
    get('start-button').value = 'Start (' + ls.getItem('dropdown12') + ')'
}
get('audio-volume').value = ls.getItem('dropdown4') === null ? 1 : parseFloat(ls.getItem('dropdown4'));
get('frames-per-purple').value = ls.getItem('dropdown2') === null ? 9 : parseInt(ls.getItem('dropdown2'));
get('max-points').value = ls.getItem('dropdown9') === null ? 50 : parseInt(ls.getItem('dropdown9'));
get('max-time').value = ls.getItem('dropdown5') === null ? 0 : parseInt(ls.getItem('dropdown5'));
get('ms-per-coin-move').value = ls.getItem('dropdown0') === null ? 100 : parseInt(ls.getItem('dropdown0'));
get('ms-per-player-move').value = ls.getItem('dropdown1') === null ? 100 : parseInt(ls.getItem('dropdown1'));
get('orange-miss-select').value = ls.getItem('dropdown3') === null ? 1 : parseInt(ls.getItem('dropdown3'));
get('purple-catch-select').value = ls.getItem('dropdown10') === null ? 1 : 0;
get('wrap-select').value = ls.getItem('dropdown6') === null ? 0 : parseInt(ls.getItem('dropdown6'));

/*setup game margin-top*/
get('y-margin').value = ls.getItem('dropdown7') === null ? 0 : parseInt(ls.getItem('dropdown7'));
get('lol-a-table').style.marginTop = get('y-margin').value + 'px';

window.onkeydown = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;
    if(String.fromCharCode(i) === get('move-keys').value[0]){/*left move key*/
        key_left = 1
    }else if(String.fromCharCode(i) === get('move-keys').value[1]){/*right move key*/
        key_right = 1
    }else if(String.fromCharCode(i) === get('start-key').value){
        stop();
        start()
    }else if(i === 27){/*ESC*/
        stop()
    }
};

window.onkeyup = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;
    if(String.fromCharCode(i) === get('move-keys').value[0]){
        key_left = 0
    }else if(String.fromCharCode(i) === get('move-keys').value[1]){
        key_right = 0
    }
}
