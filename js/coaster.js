var fired = false;
var idle = true;
var open_window_timeout = 0;
var start_key_timeout = 0;
var game_level_timer = 45;
var timer_id;
var interval_flag;
var game_score = 0;
var level_score = 0;
var traintween = {stop: function(){return true;}};
var started_keys = [];
var keys_in_zone = [];
var key_height = 0;
var key_offsets = {
  left: {top: 0, bottom: 0},
  right: {top: 0, bottom: 0},
  up: {top: 0, bottom: 0},
  down: {top: 0, bottom: 0}
};


$(document).ready(function(){
   $("#play").on('click', function(){
     start_game();
   });

  setInterval(check_key_progress, 50);   
    $('html').keydown(function(e){
        if(!fired) {
            if (e.which == 37) {
                fired = true;
                check_key("left");
            }
            else if (e.which == 38) {
                fired = true;
                check_key("up");
            }
            else if (e.which == 39) {
                fired = true;
                check_key("right");
            }
            else if (e.which == 40) {
                fired = true;
                check_key("down");
            }
        }
    });

    $('html').keyup(function(e) {
        fired = false;
    });
});

/* ==========================================================================
   Pre-Game Helper functions
   ========================================================================== */

var key_up = {
  width: "9vw",
  target: "up",
  class: "",
  html: function(){
          return $('<div class="key key--up '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M36.3,54.8c0,0.7,0.5,1.2,1.2,1.2l0,0c0.7,0,1.2-0.5,1.2-1.2V23l9.6,9.6c0.5,0.4,1.2,0.4,1.7,0l0,0c0.4-0.5,0.4-1.2,0-1.7L38.3,19.3c-0.5-0.4-1.2-0.4-1.7,0L25.1,30.9c-0.4,0.5-0.4,1.2,0,1.7l0,0c0.5,0.4,1.2,0.4,1.7,0l9.6-9.6V54.8z"/></g></svg></div>');
        }
};

var key_down = {
  width: "16vw",
  target: "down",
  class: "",
  html: function(){
          return $('<div class="key key--down '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M38.7,20.2c0-0.7-0.5-1.2-1.2-1.2l0,0c-0.7,0-1.2,0.5-1.2,1.2V52l-9.6-9.6c-0.5-0.4-1.2-0.4-1.7,0l0,0c-0.4,0.5-0.4,1.2,0,1.7l11.6,11.6c0.5,0.4,1.2,0.4,1.7,0l11.6-11.6c0.4-0.5,0.4-1.2,0-1.7l0,0c-0.5-0.4-1.2-0.4-1.7,0L38.7,52V20.2z"/></g></svg></div>');
        }
};

var key_left = {
  width: "2vw",
  target: "left",
  class: "",
  html: function(){
          return $('<div class="key key--left '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M23,36.3l9.6-9.6c0.4-0.4,0.4-1.2,0-1.7l0,0c-0.4-0.4-1.2-0.4-1.7,0L19.3,36.7c-0.4,0.4-0.4,1.2,0,1.7l11.6,11.6c0.4,0.4,1.2,0.4,1.7,0l0,0c0.4-0.4,0.4-1.2,0-1.7L23,38.7h31.8c0.7,0,1.2-0.5,1.2-1.2l0,0c0-0.7-0.5-1.2-1.2-1.2H23z"/></g></svg></div>');
        }
};

var key_right = {
  width: "23vw",
  target: "right",
  class: "",
  html: function(){
          return $('<div class="key key--right '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M20.2,36.3c-0.7,0-1.2,0.5-1.2,1.2l0,0c0,0.7,0.5,1.2,1.2,1.2H52l-9.6,9.6c-0.4,0.5-0.4,1.2,0,1.7l0,0c0.5,0.4,1.2,0.4,1.7,0l11.6-11.6c0.4-0.5,0.4-1.2,0-1.7L44.1,25.1c-0.5-0.4-1.2-0.4-1.7,0l0,0c-0.4,0.5-0.4,1.2,0,1.7l9.6,9.6H20.2z"/></g></svg></div');
        }
};

/* ==========================================================================
   Reset functions
   ========================================================================== */

function start_game() {
    hide_overlays();
    show_toolbar();
    clean_slate();
    initialize_game(1);
}

function hide_overlays() {
    $('.instruction-overlay').hide();
    $('.result-overlay').hide();
}

function clean_slate() {
  $('.key').remove();
  game_score = 0;
  forward = 0;
  clearTimeout(start_key_timeout);
  if(traintween) {
    traintween.stop();
  }
  clearInterval(interval_flag);
  started_keys = [];
  stop_coaster();
  $('.arrow-guide').removeClass('glow');
  $('#coaster').removeClass('coaster-slow');
  $('#coaster').removeClass('coaster-medium');
  $('#coaster').removeClass('coaster-fast');
}

function setup_level(level) {
  switch (level) {
    case 1:
      level_score = level1.score;
      $('.keyboard').show();
      store_key_offsets();
      start_level(level1.keys());
      start_coaster();
      break;
    case 2:
      level_score = level2.score;
      start_level(level2.keys());
      start_coaster();
      break;
    case 3:
      level_score = level3.score;
      start_level(level3.keys());
      start_coaster();
      break;
    default:
      console.log("Levels exhausted. Sorry!");
  }
}

var level1 = {
  count: 22,
  score: 1100,
  keys: function() {
             return get_keys(this.count);
           }
};

var level2 = { 
  count: 30,
  score: 1800,
  keys: function() {
            return get_keys(this.count);
         }
}

var level3 = {
  count: 40,
  score: 3000,
  keys: function() {
           return get_keys(this.count);
         }
}

function get_keys(count) {
    var level_keys = [];
    console.log("key count: "+count);
    for(i=0; i< count; i++) {
      level_keys.push(Object.create(key_up));
      level_keys.push(Object.create(key_down));
      level_keys.push(Object.create(key_left));
      level_keys.push(Object.create(key_right));
    }
    return shuffle(level_keys).slice(0, count); 
};

function start_level(keys) {
  Main();
  var key_set = shuffle(keys);
  var interval = game_level_timer / key_set.length;
  interval_flag = setInterval(function(){
    if(key_set.length == 0) {
      clearInterval(interval_flag);
    }
    else {
      item = key_set.shift();
      item.class = "key_"+key_set.length;
      item.html().insertAfter('.first-key');
      
      started_keys.push(item);
    }
  }, interval * 1000);
}

function show_results() {
  clearInterval(timer_id);
  clearTimeout(open_window_timeout);
  idle=false;
  remove_toolbar_exit();
  $('.result-overlay').find('.final_points').text($('.toolbar__score').find('.toolbar__value').text());
  $('.result-overlay').show();
}

function check_key(direction) {
    if(keys_in_zone.length) {
      item = keys_in_zone.shift();
      if(item.target == direction){
        success_key(item);
        update_score();   
      }
      else {
        failure_key(item);
      }
    }
    else if(started_keys.length) {
      item = started_keys.shift();
      failure_key(item);
    }
    $('.arrow-guide').removeClass('glow');
}

function update_score() {
    game_score = game_score + 100;
    update_score_html(100);
    if(game_score >= level_score) {
      setTimeout(function(){
        announce_level_up(game_level + 1);
      }, 1000);
      //initialize_game(game_level + 1);
    }   
}

function store_key_offsets() {
  key_height = $('.arrow-guide--left').height();

  offset = $('.arrow-guide--left').offset();
  key_offsets.left.top = offset.top;
  key_offsets.left.bottom = offset.top + key_height;

  offset = $('.arrow-guide--right').offset();
  key_offsets.right.top = offset.top;
  key_offsets.right.bottom = offset.top + key_height;

  offset = $('.arrow-guide--up').offset();
  key_offsets.up.top = offset.top;
  key_offsets.up.bottom = offset.top + key_height;
  
  offset = $('.arrow-guide--down').offset();
  key_offsets.down.top = offset.top;
  key_offsets.down.bottom = offset.top + key_height;
}

function check_key_progress() {
  if(started_keys.length > 0) {
    //Check if a highlighted circle needs to be calmed down
    if(keys_in_zone.length) {
      offset = key_offsets[keys_in_zone[0].target];
      if(!check_vicinity(offset, keys_in_zone[0])){
        item = keys_in_zone.shift();
        remove_vicinity_glow(item.target);
      }
    }
    
    //Check if the next key in line is in the vicinity
    offset = key_offsets[started_keys[0].target];
    if(check_vicinity(offset, started_keys[0])){
      item = started_keys.shift();
      add_vicinity_glow(item.target);
      keys_in_zone.push(item);
    }
    //Pop out the key if it triggered 
  }
}

function check_vicinity(target, key) {
  offset = $('.'+key.class).offset();
  if(target.bottom > offset.top && target.top < (offset.top + key_height)) {
    return true;
  }
  return false;
}

function add_vicinity_glow(direction) {
  switch (direction) {
    case "left":
      $('.arrow-guide--left').addClass('glow');
      break;
    case "right":
      $('.arrow-guide--right').addClass('glow');
      break;
    case "up":
      $('.arrow-guide--up').addClass('glow');
      break;
    case "down":
      $('.arrow-guide--down').addClass('glow');
      break;
    default:
      console.log("direction do not match");
  }
}

function remove_vicinity_glow(direction) {
  switch (direction) {
    case "left":
      $('.arrow-guide--left').removeClass('glow');
      break;
    case "right":
      $('.arrow-guide--right').removeClass('glow');
      break;
    case "up":
      $('.arrow-guide--up').removeClass('glow');
      break;
    case "down":
      $('.arrow-guide--down').removeClass('glow');
      break;
    default:
      console.log("direction do not match");
  }
}

function success_key(item) {
  $('.'+item.class).addClass('success');
}

function failure_key(item) {
  $('.'+item.class).addClass('failure');
}

/* ==========================================================================
   Roller Coaster 
   ========================================================================== */

   function start_coaster() {
      Main();
      setTimeout(function(){
        $('#coaster').addClass('coaster-medium');
      }, 3000);
   }

   function stop_coaster() {
      traintween.stop();
   }

   var flag = false;
   var forward = 0;
   var counter = 0;
   setTimeout(function() {
      flag = true;
   }, 15000);
    function Main() {
        vars();
        launchTrains();
        animate();
    }

    vars = function() {
      var cabin, i, _i, _j;
      this.train1 = {
        cabins: [],
        background: document.getElementById('coaster'),
        path: document.getElementById('cabinpath')
      };
      for (i = _i = 1; _i <= 3; i = ++_i) {
        if (cabin = document.getElementById("js-train-cabin" + i)) {
          this.train1.cabins.push(cabin);
        }
      }
      this.cabinWidth = 1 * this.train1.cabins[0].getBoundingClientRect().width;
      this.childNode = 0;
      this.childMethod = 'children';
      return this.animate = this.bind(this.animate, this);
    };
    
    launchTrains = function() {
      var it;
      it = this;
      var timePrev = Date.now();
      var speed = 65000;
      totallength = this.train1.path.getTotalLength();
      duration = totallength * 100 / 28.6 ;
      console.log(duration);
      traintween = new TWEEN.Tween({
        length: totallength
      }).to({
        length: 0
      /*}, 8000).onUpdate(function() {*/
      }, duration).onUpdate(function() {
          // if(flag){
          //   flag = false;
          //   traintween.stop();
          //   var timeNow = Date.now();
          //   var timeDiff = timeNow - timePrev;
          //   traintween.to({length: 0}, 10000);
          //   traintween.start();
          // }
          var angle, attr, cabin, cabinChild, i, point, prevPoint, shift, x, x1, x2, y, _i, _len, _ref, _results;
          _ref = it.train1.cabins;
          _results = [];

          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            cabin = _ref[i];
            shift = i * it.cabinWidth ;
        
              point = it.train1.path.getPointAtLength(this.length - shift);
              prevPoint = it.train1.path.getPointAtLength(this.length - shift - 1);
              x1 = point.y - prevPoint.y;
              x2 = point.x - prevPoint.x;
              angle = Math.atan(x1 / x2) * (180 / Math.PI);
              x = point.x - 35;
              y = point.y - 35;
              if (point.x - prevPoint.x > 0) {
                //forward += -0.1;
                if (!cabin.isRotated) {
                  cabinChild = cabin[it.childMethod][it.childNode];
                  cabinChild.setAttribute('xlink:href', '#coasterreverse');
                  cabin.isRotated = true;
                }
              } else {
                //forward += -0.37;
                if (cabin.isRotated) {
                  cabinChild = cabin[it.childMethod][it.childNode];
                  cabinChild.setAttribute('xlink:href', '#coasterforward');
                  cabin.isRotated = false;
                }

              }

              attr = "translate(" + x + ", " + y + ") rotate(" + (angle || 0) + ",38,23)";
              _results.push(cabin.setAttribute('transform', attr));
          }
          
          //attr = "translate(" + forward + "px, 0)";
          //_results.push(it.train1.background.setAttribute('style', 'transform: '+attr));
          
          

          return _results;
      /*}).start();*/
      }).start();
    };
  
    animate = function() {
        requestAnimationFrame(this.animate);
        return TWEEN.update();
    };

    bind = function(func, context) {
      var bindArgs, wrapper;
      wrapper = function() {
        var args, unshiftArgs;
        args = Array.prototype.slice.call(arguments);
        unshiftArgs = bindArgs.concat(args);
        return func.apply(context, unshiftArgs);
      };
      bindArgs = Array.prototype.slice.call(arguments, 2);
      return wrapper;
    };
