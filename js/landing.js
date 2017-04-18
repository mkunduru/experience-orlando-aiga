$(document).ready(function(){
    $('.minigame-section').hover(
        function() {
            $(this).find('img').show();
        },
        function() {
            $(this).find('img').hide();
        }
    );

    $('.minigame-section').click(function(e){
        window.location.href = $(this).find('a').attr('href');
    });
});