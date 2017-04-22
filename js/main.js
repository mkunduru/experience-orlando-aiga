var idleRedirect = null;
var idleRedirectTimer = null;
var idleRedirectTimer = 10;
var idleRedirectflag = false;
var IDLE_TIMEOUT = 60; //seconds
var idleSecondsCounter = 0;

$(document).ready(function(){
    $('.button.idle-yes').click(function(){
        clear_idle_stuff();
        window.location.href = "index.html";
    });

    $('.button.idle-no').click(function(){
        clear_idle_stuff();
        $('.timeout-overlay').hide();
    });
    
    document.onclick = function() {
         idleSecondsCounter = 0;
    };
    document.onmousemove = function() {
        idleSecondsCounter = 0;
    };
    document.onkeypress = function() {
        idleSecondsCounter = 0;
    };
    window.setInterval(CheckIdleTime, 1000);

    function CheckIdleTime() {
        idleSecondsCounter++;

        if (idleSecondsCounter >= IDLE_TIMEOUT && !idleRedirectflag) {
            idleRedirectflag = true;
            $('.timeout-overlay').show();
            $('.timeout-overlay__text__timer').text(idleRedirectTimer);
            idleRedirectCounter = setInterval(function(){
                idleRedirectTimer = idleRedirectTimer - 1;

                if(idleRedirectTimer > 0) {
                    $('.timeout-overlay__text__timer').text(idleRedirectTimer);
                }
                else {
                   clearInterval(idleRedirectCounter);
                   $('.button.idle-yes').click(); 
                }
            }, 1000);       
        }
    }
});

function clear_idle_stuff(){
    clearTimeout(idleRedirect);
    idleRedirectTimer = 10;
    idleRedirectflag = false;
    clearInterval(idleRedirectCounter);
}