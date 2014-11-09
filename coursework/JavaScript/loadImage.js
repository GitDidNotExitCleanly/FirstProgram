// JavaScript Document

window.onload = function() {
	
	var MAX_WIDTH = 700;
	var MIN_WIDTH = 200;
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var img = new Image();
	img.src = "./Images/test.jpg";
	
	img.onload = function() {
		if (img.width < MIN_WIDTH) {
			img.height *= MIN_WIDTH/img.width;
			img.width = MIN_WIDTH;	
		}
		if (img.width > MAX_WIDTH) {
			img.height *= MAX_WIDTH/img.width;
			img.width = MAX_WIDTH;
		}
		canvas.width = img.width;
		canvas.height = img.height;
		var windowHeight = parseInt($('#canvas').parent('section').css('height'));
		var marginTop = (windowHeight - canvas.height)/2;
		$('#canvas').css('margin-top',marginTop+'px');
		context.drawImage(img,0,0,img.width,img.height);
		
		canvas.onmousewheel = function(event) {
			context.clearRect(0,0,img.width,img.height);
			var resize = event.wheelDelta / 120;
			var ratio = img.width / img.height;
			if (resize > 0) {
				if (img.width < MAX_WIDTH) {
					img.height =img.height + resize*3;
					img.width =img.width + resize*ratio*3;
				}
			}
			else {
				if (img.width > MIN_WIDTH) {
					img.height =img.height + resize*3;
					img.width =img.width + resize*ratio*3;	
				}
			}
			canvas.width = img.width;
			canvas.height = img.height;
			var windowHeight = parseInt($('#canvas').parent('section').css('height'));
			var marginTop = (windowHeight - canvas.height)/2;
			$('#canvas').css('margin-top',marginTop+'px');
			context.drawImage(img,0,0,img.width,img.height);	
		}
	}
	
	
};

