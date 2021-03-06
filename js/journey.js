$(document).ready(function() {
  setTimeout(function(){
    show_bio();
  },4000);

  $('.button').on('click', function(){
    hide_bio();
    $('#map2').addClass('start_landing');
    $('#flightpath2').addClass('start_landing');
    $('#flight1').addClass('start_landing');
    setTimeout(function(){
      window.location.href = "landing.html";
    }, 4800);
  });

  $('.button').hover(function(){
    $('.button').css("background", "#FFFFFF");
    $('#next-arrow').css("stroke", "#46c6e5");
  }, function(){
    $('.button').css("background", "transparent");
    $('#next-arrow').css("stroke", "#FFFFFF");
  });
});

function show_bio() {
  $('#bio').fadeIn(1000, "linear");
}

function hide_bio() {
  $('#bio').fadeOut(1000, "linear");
}

// function start_bio() {
//   //generate content
//     for (var i = 0; i < content.length; i++) {
//       //split content letters to array
//       for (var obj in content[i]) {
//         //if string
//         if (typeof content[i][obj] === "string") {
//           content[i][obj] = content[i][obj].split("");
//           continue;
//         }
//         //if array (grouped text)
//         else if (typeof content[i][obj] === "object") {
//           var toPush = [];
//           for(var j = 0; j < content[i][obj].length; j++) {
//             for(var k = 0; k < content[i][obj][j].length; k++) {
//               toPush.push(content[i][obj][j][k]);
//             }
//           }
//           content[i][obj] = toPush;
//         }
//       }
//       //set text to 
//       $("#segments").append("<div class=\"letters-wrap mutable\"><div class=\"soup-title\"></div><div class=\"soup-desc\"></div></div>");
//       setText();
//       //clone to data
//       $("#segments").append("<div class=\"letters-wrap position-data\"><div class=\"soup-title\"></div><div class=\"soup-desc\"></div></div>");
//       setText();
//     }
//     scrambleOthers();
//     //setInterval(function(){
//     $('.letter').fadeIn(1500);
//     $('#navigate').fadeIn(2500);
//     arrangeCurrentPage();
//     //}, 2000);

//     function setText() {
//       var j;
//       for (j = 0; j < content[i].title.length; j++) {
//         $(".soup-title").last().append("<span class=\"letter\">" + content[i].title[j] + "</span>");
//         $('.letter').hide();
//       }
//       for (j = 0; j < content[i].desc.length; j++) {
//         $(".soup-desc").last().append("<span class=\"letter\">" + content[i].desc[j] + "</span>");
//         $('.letter').hide();
//       }
//     }

//     function arrangeCurrentPage() {
//       for (var i = 0; i < content[currentPage].title.length; i++) {
//         $(".mutable:eq(" + currentPage + ") > .soup-title > .letter").eq(i).css({
//           left: $(".position-data:eq(" + currentPage + ") > .soup-title > .letter").eq(i).offset().left + "px",
//           top: $(".position-data:eq(" + currentPage + ") > .soup-title > .letter").eq(i).offset().top + "px",
//           color: "#fff",
//           zIndex: 9001
//         });
//       }
//       for (var i = 0; i < content[currentPage].desc.length; i++) {
//         $(".mutable:eq(" + currentPage + ") > .soup-desc > .letter").eq(i).css({
//           left: $(".position-data:eq(" + currentPage + ") > .soup-desc > .letter").eq(i).offset().left + "px",
//           top: $(".position-data:eq(" + currentPage + ") > .soup-desc > .letter").eq(i).offset().top + "px",
//           color: "#fff",
//           zIndex: 9001
//         });
//       }
//     }
// }

// function scrambleOthers() {
//   for (var i = 0; i < content.length; i++) {
//     //don't scramble currentPage
//     //if (currentPage === i)
//     //  continue;
//     var parts = [
//       ["title", ".soup-title"],
//       ["desc", ".soup-desc"]
//     ];
//     //apply to .title h1s and .desc ps
//     for (var j = 0; j < parts.length; j++) {
//       for (var k = 0; k < content[i][parts[j][0]].length; k++) {
//         //define random position on screen
//         var randLeft = Math.floor(Math.random() * $(window).width());
//         var randTop = Math.floor(Math.random() * $(window).height());
//         //defining boundaries
//         var offset = $(".position-data").eq(currentPage).offset();
//         var bounds = {
//           left: offset.left,
//           top: offset.top,
//           right: $(window).width() - offset.left,
//           bottom: $(window).height() - offset.top
//         };
//         var middleX = bounds.left + $(".position-data").eq(currentPage).width() / 2;
//         var middleY = bounds.top + $(".position-data").eq(currentPage).height() / 2;
//         //finally, apply all the scrambles
//         $(".mutable:eq(" + i + ") > " + parts[j][1] + " > .letter").eq(k).css({
//           left: randLeft,
//           top: randTop,
//           color: "#DDD",
//           zIndex: "initial"
//         });
//       }
//     }
//   }
// }