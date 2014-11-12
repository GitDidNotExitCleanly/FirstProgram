  // JavaScript Document
$(document).ready(function(e) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
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
	
	var dragging = false;
	var editing = false;
	var iX, iY;	
	function Draw(arg) {
	  if (arg.nodeType) {
		  this.canvas = arg;
	  } 
	  else if (typeof arg == 'string') {
		  this.canvas = document.getElementById(arg);
	  } 
	  else {
		  return;
	  }
	  this.init();
	}
	Draw.prototype = {
		init: function() {
			var that = this;
			if (!this.canvas.getContext) {
				return;
			}
			this.context = this.canvas.getContext('2d');
			this.canvas.onselectstart = function () {
				return false;
			};
			this.canvas.onmousedown = function(event) {
				if (editing && $('#tabMenu li[value="paint"]').hasClass('selected')) {
					that.context.lineWidth = $('#paint select').val();
					that.drawBegin(event);
				}
			};
		},
		drawBegin: function(e) {
			var that = this,
				stage_info = this.canvas.getBoundingClientRect();
			window.getSelection ? window.getSelection().removeAllRanges() :
									document.selection.empty();
			this.context.moveTo(
				e.clientX - stage_info.left,
				e.clientY - stage_info.top
			);
			document.onmousemove = function(event) {
				that.drawing(event);
			};
			document.onmouseup = this.drawEnd;	
		},
		drawing: function(e) {
			var stage_info = this.canvas.getBoundingClientRect();
			this.context.lineTo(
				e.clientX - stage_info.left,
				e.clientY - stage_info.top
			);
			this.context.stroke();
		},
		drawEnd: function() {
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
		  	document.onmouseup = function(e) {
				dragging = false;
			  	$("#canvas").releaseCapture();
			  	e.cancelBubble = true;		
		  	};
		}
	};
	
	// dealing with image dragging
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
	document.onmouseup = function(e) {
		dragging = false;
	   	$("#canvas").releaseCapture();
	   	e.cancelBubble = true;		
	};

	// initial image display
	var MAX_WIDTH = 764;
	var MIN_WIDTH = 200;
	
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
	   $('#canvas').addClass('draggable').removeClass('editable');
	   removeEditingPrompt();
	   if ($('#tabMenu li[value="paint"]').hasClass('selected')) {
			$('#paint button[name="stop"]').hide();
			$('#paint button[name="paint"]').show();   
	   }
		
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
		  $('#canvas').removeClass('draggable').addClass('editable');
		  addEditingPrompt();
	  }	
  });
  $('#canvas').click(function(event) {
	  if (editing && $('#tabMenu li[value="text"]').hasClass('selected')) {
		  var x_axis = event.pageX - $(this).offset().left - ($('#text p').width()/2);
		  var y_axis = event.pageY - $(this).offset().top;
		  context.font = $('#text p').css('font-style')+" "+$('#text p').css('font-size')+" sans-serif" ;
		  context.fillStyle = $('#text p').css('color');
		  context.fillText($('#text p').text(),x_axis,y_axis);
		  editing = false;
		  $('#canvas').addClass('draggable').removeClass('editable');
		  removeEditingPrompt();
	  }
  });
  
  	// dealing with shape adding

	
  	// dealing with drawing
  	var previewCanvas = document.getElementById('previewCanvas');
	var previewContext = previewCanvas.getContext("2d");
	previewContext.font = "42px normal sans-serif";
	previewContext.fillText("Preview",85,90);
  	$('#paint input').click(function() {
		previewContext.strokeStyle = $(this).css('background-color');
		context.strokeStyle = $(this).css('background-color');
	});
	$('#paint button[name="preview"]').click(function() {
		previewContext.clearRect(0,0,previewCanvas.width,previewCanvas.height);
		previewContext.lineWidth = 	$('#paint select').val();
		previewContext.strokeRect(100,50,100,50);
	});
	$('#paint button[name="paint"]').click(function() {
		editing = true;
		$('#canvas').removeClass('draggable').addClass('editable');
		$(this).hide();
		$('#paint button[name="stop"]').show();
		addEditingPrompt();
		var draw = new Draw('canvas');
	});
	$('#paint button[name="stop"]').click(function() {
		editing = false;
		$('#canvas').addClass('draggable').removeClass('editable');
		$(this).hide();
		$('#paint button[name="paint"]').show();
		removeEditingPrompt();
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
		$('#canvas').removeClass('draggable').removeClass('editable');
		removeEditingPrompt();
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
			$('#canvas').addClass('draggable').removeClass('editable');
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
			$('#canvas').addClass('draggable');
			removeEditingPrompt();
			$('#step3').fadeOut('fast',function(e) {
				$('#step2').fadeIn('fast');	
			});	
		}
	});
});