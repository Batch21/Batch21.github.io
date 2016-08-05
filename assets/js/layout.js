$(document).ready(function(){
  var waypoints = $('.chapter').waypoint({
    handler: function(direction) {
    	var chapterList = $("#chapter-list li");
    	for (var i = 0; i < chapterList.length; i++) {
    		if(chapterList[i].className == this.element.className.split(/\s+/)[1]){
    			if(!$(chapterList[i]).hasClass('current')) {
  	  			$('#chapter-list li.current').removeClass('current');
  	  			$(chapterList[i]).addClass('current');
  	  		}
    		}else if($(chapterList[i]).hasClass('current') & this.element.className.split(/\s+/)[1] != "chap-1") {
    			$('#chapter-list li.current').removeClass('current');
  	  		$(chapterList[i-1]).addClass('current');
    		}
    	}
    },
    offset: '75%' 
  });
});

var refs = $('#references li');

$('sup a').hover(function(){
  
  $(".container").append('<div id="ref-box"></div>');
  
  for (var i = 0; i < refs.length; i++) {
    if(refs[i].className == this.className){
      $("#ref-box").html(refs[i].textContent);
    } 
  }

  var top = ($(this).position().top - 48) + "px"
  var left = ($(this).position().left - 350) + "px"

  $("#ref-box").css({
    'top': top,
    'left': left
  })

}, function(){
    $("#ref-box").remove();
});

$("#ref-title").click(function(){
  $("#references").slideToggle();
  //$('html, body').animate({scrollTop: $('#ref-title').offset().top}, 'slow');
  $(this).text(function(i, text){
          return text === "Show References" ? "Hide References" : "Show References";
      })
});





