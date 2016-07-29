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
})


