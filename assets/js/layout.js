var waypoints = $('.chapter').waypoint({
  handler: function(direction) {
  	var chapterList = $("#chapter-list li");
  	for (var i = 0; i < chapterList.length; i++) {
  		if(chapterList[i].className == this.element.className.split(/\s+/)[1]){
  			if(!$(chapterList[i]).hasClass('selected')) {
	  			$('#chapter-list li.selected').removeClass('selected');
	  			$(chapterList[i]).addClass('selected');
	  		}
  		}else if($(chapterList[i]).hasClass('selected') & this.element.className.split(/\s+/)[1] != "chap-1") {
  			$('#chapter-list li.selected').removeClass('selected');
	  		$(chapterList[i-1]).addClass('selected');
  		}
  	}
  	console.log(direction)
  },
  offset: '75%' 
})
