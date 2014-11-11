  // JavaScript Document
$(document).ready(function(e) {
	function centre() {
		var top = (parseInt($('#canvas').parent().css('height')) - canvas.height)/2;
		var left = (parseInt($('#canvas').parent().css('width')) - canvas.width)/2
		$('#canvas').css({
			'top' : top+'px',
			'left' : left+'px'
		});
	}
	
	function addEditingPrompt() {
	  $('<div id="editingPrompt" style="width: 1024px; height: 600px;background-color: #000; color: #FFF; position: absolute; left: 0px; top: 0px; text-align: center;z-index: 1;filter:alpha(opacity:70);opacity:0.7;"> <p>Editing . . .</p></div>').appendTo($('#display'));	
  }
  
  function removeEditingPrompt() {
	  $('#editingPrompt').remove();
  }
	
	var MAX_WIDTH = 764;
	var MIN_WIDTH = 200;
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var img = new Image();
	img.src = "./Images/test2.jpg";
	var originalWidth = 0;
	var originalHeight = 0;
	var step = 1;
	
	img.onload = function() {
		if (img.width < MIN_WIDTH) {
			img.height *= MIN_WIDTH/img.width;
			img.width = MIN_WIDTH;	
		}
		if (img.width > MAX_WIDTH) {
			img.height *= MAX_WIDTH/img.width;
			img.width = MAX_WIDTH;
		}
		originalWidth = img.width;
		originalHeight = img.height;
		canvas.width = img.width;
		canvas.height = img.height;
		centre();
		$('#canvas').addClass('draggable');
		context.drawImage(img,0,0,img.width,img.height);
		$('#step1').show();
		
		// dealing with size changing
		// step 1
		canvas.onmousewheel = function(event) {
			event.preventDefault();
			if (step == 1) {
				context.clearRect(0,0,img.width,img.height);
				var resize = event.wheelDelta / 120;
				var ratio = originalWidth / originalHeight;
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
			}
		};
	};
	
	// dealing with image dragging
	var dragging = false;
	var editing = false;
	var iX, iY;
	$('#canvas').mousedown(function(e) {
		if ($(this).hasClass('draggable') && !editing) {
			dragging = true;
			iX = e.clientX - this.offsetLeft;
			iY = e.clientY - this.offsetTop;
			this.setCapture && this.setCapture();
			return false;
		}
	});
	document.onmousemove = function(e) {
	   if (dragging && !editing) {
			var e = e || window.event;
			var oX = e.clientX - iX;
			var oY = e.clientY - iY;
			if (oX < 0) {
				oX = 1;
			}
			var oX_max = parseInt($('#canvas').parent().css('width')) - canvas.width;
			if (oX > oX_max) {
				oX = oX_max - 5;
			}
			if (oY < 0) {
				oY = 1;
			}
			var oY_max = parseInt($('#canvas').parent().css('height')) - canvas.height;
			if (oY > oY_max) {
				oY = oY_max - 5;
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
	 

	// dealing with buttons
	$('#step1 a[name="next"]').click(function(event) {
		event.preventDefault();
		step = 2;
		centre();
		$('#step1').fadeOut('fast',function(event) {
			$('#step2').fadeIn('fast');		
		});
	});
	$('#step2 a[name="next"]').click(function(event) {
		event.preventDefault();
		step = 3;
		centre();
		editing = false;
		removeEditingPrompt();
		$('#canvas').removeClass('draggable');
		$('#step2').fadeOut('fast',function(event) {
			$('#step3').fadeIn('fast');		
		});
	});
	$('#step3 a[name="save"]').click(function(event) {
		event.preventDefault();
		// download
		var image = canvas.toDataURL("image/jpeg").replace("image/jpeg","image/octet-stream");
		var filename =  'newImage_' + (new Date()).getTime() + '.jpg';
		
		var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = image;
			save_link.download = filename;
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
	});
	$('div.step a[name="previous"]').click(function(event) {
		event.preventDefault();
		if (step == 2) {
			step = 1;
			centre();
			editing = false;
			removeEditingPrompt();
			context.drawImage(img,0,0,img.width,img.height);
			$('#step2').fadeOut('fast',function(e) {
				$('#step1').fadeIn('fast');	
			});
		}
		if (step == 3) {
			step = 2;
			centre();
			editing = false;
			removeEditingPrompt();
			$('#canvas').addClass('draggable');
			$('#step3').fadeOut('fast',function(e) {
				$('#step2').fadeIn('fast');	
			});	
		}
	});
	
	// dealing with Step 2 Tab --- image decoration
	
	//Get all the LI from the #tabMenu UL
  $('#tabMenu li').click(function(){
	
	//perform the actions when it's not selected
	if (!$(this).hasClass('selected')) {    
		   
	   //remove the selected class from all LI    
	   $('#tabMenu li').removeClass('selected');
		
	   //Reassign the LI
	   $(this).addClass('selected');
	   
	   editing  = false;
	   removeEditingPrompt();
		
	   //Hide all the DIV in .boxBody
	   $('.boxBody div.parent').slideUp(200);
		
	   //Look for the right DIV in boxBody according to the Navigation UL index, therefore, the arrangement is very important.
	   $('.boxBody div.parent:eq(' + $('#tabMenu > li').index(this) + ')').slideDown(200); 
	}

  });
  
  
  // Text 
  $('#font_size').change(function() {
	  var oldSize = parseInt($('#text p').css('font-size'));
	  var ratio = ($(this).val() / oldSize);
	  var oldMarginTop = parseInt($('#text p').css('margin-top'));
	  $('#text p').css({
		  'font-size' : $(this).val()+'px',
		  'margin-top' : oldMarginTop*(1/ratio)
	  });
  });
  $('#font_style').change(function() {
	  $('#text p').css('font-style',$(this).val());
  });
  $('#colour').change(function() {
	  $('#text p').css('color',$(this).val());
  });
  $('.content button[name="preview"]').click(function() {
	  if ($('#text input').val().length > 0) {
		  $('#text p').text($('#text input').val());
	  }
  });
  
  
  // dealing with text adding
  $('.content button[name="add"]').click(function() {
	  if($('#text p').text().length > 0 && !editing) {
		  editing = true;
		  addEditingPrompt();
	  }	
  });
  $('#canvas').click(function(event) {
	  if (editing) {
		  var x_axis = event.pageX - $(this).offset().left;
		  var y_axis = event.pageY - $(this).offset().top;
		  context.font = $('#text p').css('font-style')+" "+$('#text p').css('font-size')+" sans-serif" ;
		  context.fillStyle = $('#text p').css('color');
		  context.fillText($('#text p').text(),x_axis,y_axis);
		  editing = false;
		  removeEditingPrompt();
	  }
  });
  
  // dealing with shape adding

	
	
	
	
	
});

