// JavaScript Document
$(document).ready(function(e) {
    
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
		var top = (parseInt($('#canvas').parent().css('height')) - canvas.height)/2;
		var left = (parseInt($('#canvas').parent().css('width')) - canvas.width)/2
		$('#canvas').css({
			'top' : top+'px',
			'left' : left+'px'})
			.addClass('draggable');
		context.drawImage(img,0,0,img.width,img.height);
		$('#step1').show();
		
		canvas.onmousewheel = function(event) {
			event.preventDefault(); 
			context.clearRect(0,0,img.width,img.height);
			var resize = event.wheelDelta / 120;
			var ratio = img.width / img.height;
			if (resize > 0) {
				if (img.width < MAX_WIDTH) {
					img.height =img.height + resize*4;
					img.width =img.width + resize*ratio*4;
				}
			}
			else {
				if (img.width > MIN_WIDTH) {
					img.height =img.height + resize*4;
					img.width =img.width + resize*ratio*4;	
				}
			}
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img,0,0,img.width,img.height);
			
		};
	};
	
	var dragging = false;
    var iX, iY;
	$('#canvas').mousedown(function(e) {
		if ($(this).hasClass('draggable')) {
			dragging = true;
			iX = e.clientX - this.offsetLeft;
            iY = e.clientY - this.offsetTop;
            this.setCapture && this.setCapture();
            return false;
		}
	});
	document.onmousemove = function(e) {
       if (dragging) {
       		var e = e || window.event;
            var oX = e.clientX - iX;
            var oY = e.clientY - iY;
			if (oX < 0) {
				oX = 1;
			}
			var oX_max = parseInt($('#canvas').parent().css('width')) - canvas.width;
			if (oX > oX_max) {
				oX = oX_max - 7;
			}
			if (oY < 0) {
				oY = 1;
			}
			var oY_max = parseInt($('#canvas').parent().css('height')) - canvas.height;
			if (oY > oY_max) {
				oY = oY_max - 7;
			}
            $("#canvas").css({"left":oX + "px", "top":oY + "px"});
            return false;
       }
    };
	$(document).mouseup(function(e) {
       dragging = false;
       $("#canvas").releaseCapture();
       e.cancelBubble = true;
    });
	 
	$('#step1 fieldset').first().click(function() {
			
	});
});

