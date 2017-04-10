var card_set = ['card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6'];
var game_level = 0;
var open_window_timeout = 0;
var idle = false;
var cancel_instruction_timer = false;
var level_timer = 30;
var timer_id;

$(document).ready(function(){
    $('#memoryplay').on('click', function() {
        start_game();
        display_instruction();
    });

    $('body').bind('mousedown', function(event) {
      if(idle) {
        switch (event.which) {
          case 1:
              idle=false;
        }
      }
    });

    $('.window').on('click', function() {
        if(!$(this).hasClass('window--locked')) {
            clearTimeout(open_window_timeout);
            check_open_windows();
            click_window($(this));
            check_matching_cards();
            open_window_timeout = setTimeout(check_open_windows, 1200);
        }
    });

    $('.play_again').on('click', function(){
      start_game();
    });

    $('.toolbar__exit').on('click', function(){
      game_over();
    });
});

/* ==========================================================================
   Initialize Game Level
   ========================================================================== */

function initialize_game(level) {
    game_level = level;
    switch (level) {
        case 1:
            play_level_1();
            break;
        case 2:
            play_level_2();
            break;
        case 3:
            play_level_3();
            break;
        default:
            game_winner();
    }
}

function play_level_1() {
    clean_slate();
    set_game_level();
    open_windows(4);
    reset_timer();
}

function play_level_2() {
    clean_slate();
    set_game_level();
    open_windows(8);
    reset_timer();
}

function play_level_3() {
    clean_slate();
    set_game_level();
    open_windows(12);
    reset_timer();
}

/* ==========================================================================
   Pre-Game Helper functions
   ========================================================================== */

function place_cards(card_count) {
    deck = shuffle(card_set).slice(0, card_count);
    playing_deck = deck.concat(deck);
    
    shuffle_deck = shuffle(playing_deck);
    for(i=0; i<shuffle_deck.length; i++) {
        $('.window:not(.window--locked)').eq(i).find('.cards').find('.'+shuffle_deck[i]).addClass('visible');
     }
     reset_timer();
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function open_windows(windows) {
    switch (windows) {
        case 4:
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 6:
            $('.window:nth-child(6n+2)').removeClass('window--locked');
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 8:
            $('.window:nth-child(6n+2)').removeClass('window--locked');
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            $('.window:nth-child(6n+5)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 10:
            $('.window:nth-child(6n+1)').removeClass('window--locked');
            $('.window:nth-child(6n+2)').removeClass('window--locked');
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            $('.window:nth-child(6n+5)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 12:
            $('.window').removeClass('window--locked');
            place_cards(windows/2);
            break;
        default:
            console.log("No game designed for the number of windows requested");
    }
}

/* ==========================================================================
   Game Helper functions
   ========================================================================== */

function click_window($this) {
    if(!$this.hasClass('matched')) {
        if($this.hasClass('clicked')){
            $this.toggleClass('clicked');
            $this.find('.cards').toggleClass('clicked');
            $this.find('.window__shutter--left').toggleClass('clicked').css({"-webkit-transform": "translate(0, 0)"});
            $this.find('.window__shutter--right').toggleClass('clicked').css({"-webkit-transform": "translate(0, 0)"});
        }
        else {
            $this.toggleClass('clicked');
            $this.find('.cards').toggleClass('clicked');
            $this.find('.window__shutter--left').toggleClass('clicked').css({"-webkit-transform": "translate(-100px, 0)"});;
            $this.find('.window__shutter--right').toggleClass('clicked').css({"-webkit-transform": "translate(100px, 0)"});;
        }
    }
}

function check_open_windows() {
    if($('.window.clicked').length == 2) {
        click_window($('.window.clicked'));
    }
    check_game_progress();
}

function check_game_progress() {
    if($('.window:not(.window--locked):not(.matched)').length == 0) {
        update_score_level();
        announce_level_up(game_level + 1);
        initialize_game(game_level + 1);
    }
}

function match_cards($window1, $window2) {
    if($window1.find('.card.visible').attr('class') == 
       $window2.find('.card.visible').attr('class')) {
        $window1.removeClass('clicked').addClass('matched');
        $window2.removeClass('clicked').addClass('matched');
        update_match_score();
    }
}

function check_matching_cards() {
    if($('.window.clicked').length == 2) {
        $window1 = $('.window.clicked').eq(0);
        $window2 = $('.window.clicked').eq(1);
        match_cards($window1, $window2);
    }
}

/* ==========================================================================
   Post-Game Helper functions
   ========================================================================== */

function game_winner() {
  update_result_message("Congratulations!");
  show_winner();
  show_results();
}

function game_over() {
  update_result_message("Game Over");
  show_loser();
  show_results();
}

/* ==========================================================================
   Timer functions
   ========================================================================== */

function reset_timer() {
  clearInterval(timer_id);
  level_timer = 30;
  start_timer();
}

function start_timer() {
  timer_id = setInterval(function(){
                if(level_timer > 0) {
                  level_timer = level_timer - 1;
                  set_toolbar_timer(level_timer);
                } else {
                  game_over();
                  clean_slate();
                  clearInterval(timer_id);
                }
              }, 1000);
}

function get_timer_value(time) {
  if(time < 10) {
    return "0:0"+time.toString();
  } 
  else {
    return "0:"+time.toString();
  }
}

/* ==========================================================================
   Instructions screen when user idle at start
   ========================================================================== */

function check_inactivity() {
  cancel_instruction_timer = 
    setInterval(function(){
      show_instruction();
    }, 500);
}

function show_instruction() {
  if(idle) {
    $('.mouse-instruction').show();
  }
  else {
    $('.mouse-instruction').hide();
    clearInterval(cancel_instruction_timer);
  }
}


/* ==========================================================================
   Reset functions
   ========================================================================== */

function start_game() {
    hide_overlays();
    show_toolbar();
    clean_slate();
    initialize_game(1);
}

function display_instruction() {
    idle = true;
    setTimeout(function(){
        check_inactivity()
    }, 3000);
}

function hide_overlays() {
    $('.instruction-overlay').hide();
    $('.result-overlay').hide();
}

function clean_slate() {
    $('.window').removeClass('clicked');
    $('.window').removeClass('matched');
    $('.window').addClass('window--locked');
    $('.cards').removeClass('clicked');
    $('.window__shutter--left').removeClass('clicked').css({"-webkit-transform": ""});
    $('.window__shutter--right').removeClass('clicked').css({"-webkit-transform": ""});
    $('.card').removeClass('visible');
}

/* ==========================================================================
   Toolbar functions
   ========================================================================== */
function set_game_level() {
  $('.game_level').text(game_level);
}

function show_toolbar() {
    reset_toolbar();
    $('.toolbar').show();
    $('.toolbar__exit').show();
}

function reset_toolbar() {
    $('.toolbar__score').find('.toolbar__value').text(0);
}

function set_toolbar_timer(time) {
    $('.toolbar__timer').find('.toolbar__value').text(get_timer_value(time));
}

function update_match_score() {
  points = game_level * 100;
  update_score_html(points);
}

function update_score_level() {
  points = (game_level + 1) * 500 + level_timer * 50;
  update_score_html(points);
}

function update_score_html(points) {
  current_score = parseInt($('.toolbar__score').find('.toolbar__value').text());
  new_score = current_score + points;
  $('.toolbar__score').find('.toolbar__value').text(new_score);
}

function remove_toolbar_exit() {
    $('.toolbar__exit').hide();
}

/* ==========================================================================
    Level Up Overlay
   ========================================================================== */

function announce_level_up(level) {
    $('.level-overlay').addClass('level-overlay--open');
  // $('.announce__level').text(level);
  // $('.announce').show();
  // setTimeout(function(){
  //   $('.announce__level').text("").hide();
  //   $('.announce').hide();
  // },1500)
}

/* ==========================================================================
    Results Overlay
   ========================================================================== */

function update_result_message(message) {
    $('.result-overlay').find('.result').text(message);
}

function show_winner() {
    $('.result-overlay').find('.loser').hide();
    $('.result-overlay').find('.winner').show(); 
}

function show_loser() {
    $('.result-overlay').find('.winner').hide();
    $('.result-overlay').find('.loser').show(); 
}

function show_results() {
  clearInterval(timer_id);
  clearTimeout(open_window_timeout);
  idle=false;
  remove_toolbar_exit();
  $('.result-overlay').find('.final_points').text($('.toolbar__score').find('.toolbar__value').text());
  $('.result-overlay').show();
}