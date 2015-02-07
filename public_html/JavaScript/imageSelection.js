// JavaScript Document

$(document).ready(function(e) {
	
	// horizontal display
	// image selection
	
	var linum = $('#selectFromExist .optionList li').length;
	var itemWidth = 255;
	var w = linum * itemWidth;
	$('#selectFromExist .optionList').css('width', w + 'px');	
	var clicks = 0;
	if (linum % 3 == 0) {
		clicks = ( linum / 3 ) - 1;	
	}
	else {
		clicks = (linum-(linum % 3))/3;
	}
	var count = 0; 
		
	$('#selectFromExist .next').click(function(){
		if (count < clicks) {
			count ++;
			var move = -760*count;
			$('#selectFromExist .optionList').animate({'left' : move},'slow');		
		}
	});
	
	$('#selectFromExist .prev').click(function(){
		if (count > 0) {	
			count --;
			var move = -760*count;
			$('#selectFromExist .optionList').animate({'left' : move},'slow');
		}
	});
		
	$('#selectFromExist .prev,#selectFromExist .next').hover(
		function(){	
			$(this).fadeTo('fast',1);
		},
		function(){
			$(this).fadeTo('fast',0.7
		);
	});

	// image preview
	
	$('#selectFromExist li').click(function() {
		var target = $(this).attr('value');
		$('#popUp button').attr('name',target);
		var margin = ($(document).width() - $('#popUp').width())/2;
		$('#popUp #preview').attr('src',$(this).children('img').attr('src'));
		$('#background').show();
		$('#popUp').css({'left' : margin,'top' : 50}).show();
	});
	
	$('#popUp #close').click(function() {
		$('#popUp').hide();
		$('#background').hide();
	});
	
	$('#popUp button').click(function() {
		location.href="edit.html?img="+ $(this).attr('name');	
	});
	
	// URL
	$('#selectFromURL input[type="button"]').click(function() {
		if ($('#selectFromURL input[type="text"]').val() != "") {
			location.href="edit.html?url="+ $('#selectFromURL input[type="text"]').val();			
		}	
	});
	
});