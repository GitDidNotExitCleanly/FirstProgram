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
	
	// dealing with image dragging
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
	$(document).mousemove(function(e) {
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
	});
	$(document).mouseup(function(e) {
		if (dragging) {
			dragging = false;
			$("#canvas").releaseCapture();
			e.cancelBubble = true;
		}
	});
	
	// dealing with freehand draw on canvas
	var editing = false;
	function Draw() {
		this.canvas = canvas;
		this.context = context;
	  	this.init();
	}
	Draw.prototype = {
		init: function() {
			var that = this;
			this.canvas.onselectstart = function () {
				return false;
			};
			this.canvas.onmousedown = function(event) {
				if (editing && $('#tabMenu li[value="paint"]').hasClass('selected')) {
					that.drawBegin(event);
				}
			};
		},
		drawBegin: function(e) {
			var that = this,
				stage_info = this.canvas.getBoundingClientRect();
			window.getSelection ? window.getSelection().removeAllRanges() :
									document.selection.empty();
			
			this.context.lineWidth = $('#paint select').val();
			this.context.strokeStyle = $('#paint input[name="selected"]').css('background-color');
			
			that.context.beginPath();
			this.context.moveTo(
				e.clientX - stage_info.left,
				e.clientY - stage_info.top
			);
			
			document.onmousemove = function(event) {
				that.drawing(event);
			};
			
			document.onmouseup = function() {
				that.context.closePath();
				document.onmousemove = document.onmouseup = null;
			};
		},
		drawing: function(e) {
			var stage_info = this.canvas.getBoundingClientRect();
			this.context.lineTo(
				e.clientX - stage_info.left,
				e.clientY - stage_info.top
			);
			this.context.stroke();
		}
	};
	
	function verticalDisplay(id) {
		var linum = $('#'+id+' .optionList li').length;
		var itemWidth = 200;
		var w = linum * itemWidth;
		$('#'+id+' .optionList').css('width', w + 'px');
			
		var clicks = 0;
		if (linum % 4 == 0) {
			clicks = ( linum / 4 ) - 1;	
		}
		else {
			clicks = (linum-(linum % 4))/4;
		}
		var count = 0; 
		
		$('#'+id+' .next').click(function(){
			if (count < clicks) {
				count ++;
				var move = -710*count;
				$('#'+id+' .optionList').animate({'left' : move},'slow');		
			}
		});
	
		$('#'+id+' .prev').click(function(){
			if (count > 0) {	
				count --;
				var move = -710*count;
				$('#'+id+' .optionList').animate({'left' : move},'slow');
			}
		});
			
		$('#'+id+' .prev,#'+id+' .next').hover(
			function(){	
				$(this).fadeTo('fast',1);
			},
			function(){
				$(this).fadeTo('fast',0.7
			);
		});
	}
	
	
			
	/*********************************/
	/* 			Step 1				 */
	/*********************************/
	
	// initial image display
	
	var MAX_WIDTH = 650;
	var MIN_WIDTH = 200;
	
	var img = new Image();
	img.src = "./Images/test3.jpg";
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
		
		
		// dealing with resizable canvas
		
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
	
	
	
	/*********************************/
	/* 			Step 2				 */
	/*********************************/
	
	/*				Tab				*/
	
	//Get all the LI from the #tabMenu UL
  $('#tabMenu li').click(function(){
	
	//perform the actions when it's not selected
	if (!$(this).hasClass('selected')) {    
		   
	   //remove the selected class from all LI    
	   $('#tabMenu li').removeClass('selected');
		
	   //Reassign the LI
	   $(this).addClass('selected');
	   
	   // set tab colour
	   $('#tabMenu li').css('background-color','');
	   var tab = $(this).attr('value');
	   var colour = $('.box div#'+tab).css('background-color');
	   $(this).css('background-color',colour);
	   
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
  
 
  /*				Text				*/
  
  // text options and preview
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
  
  // text add
  $('.content button[name="add"]').click(function() {
	  if(!editing) {
		  editing = true;
		  $('#canvas').removeClass('draggable').addClass('editable');
		  addEditingPrompt();
	  }	
  });
  $('#canvas').click(function(event) {
	  if (editing && $('#tabMenu li[value="text"]').hasClass('selected')) {
		  var x_axis = event.pageX - $(this).offset().left - ($('#text p').width()/2);
		  var y_axis = event.pageY - $(this).offset().top + ($('#text p').height()/4);
		  context.font = $('#text p').css('font-style')+" "+$('#text p').css('font-size')+" sans-serif" ;
		  context.fillStyle = $('#text p').css('color');
		  context.fillText($('#text p').text(),x_axis,y_axis);
		  editing = false;
		  $('#canvas').addClass('draggable').removeClass('editable');
		  removeEditingPrompt();
	  }
  });
  $('.content button[name="cancel"]').click(function() {
	  if(editing) {
		  editing = false;
		  $('#canvas').addClass('draggable').removeClass('editable');
		  removeEditingPrompt();
	  }	
  });
  	
  	
	/*				Shape				*/
	// vertical display
	verticalDisplay('shape');

	// shape size and start
	$('#shape li').click(function() {
		$('#shape li').attr('name','');
		$('#shape li img').css('border','none');
		$(this).attr('name','selected');
		$(this).children('img').css('border','2px solid #000');
	});
	$('#shape section button[name="add"]').click(function() {
		if(!editing) {
			editing = true;
		  	$('#canvas').removeClass('draggable').addClass('editable');
		  	addEditingPrompt();
		}
	});
	$('#canvas').click(function(event) {
		if (editing && $('#tabMenu li[value="shape"]').hasClass('selected')) {
			var x_axis = event.pageX - $(this).offset().left - ($('#text p').width()/2);
		  	var y_axis = event.pageY - $(this).offset().top;
			var shape = $('#shape li[name="selected"]').val();
			var size = $('#shape #shape_size').val();
			context.strokeStyle = $('#shape #shape_colour').val();
			context.lineWidth = 4;	
			
			switch (shape) {
				case 0:
					var width = 0;
					var height = 0;
					if (size == 'small') {
						width = 60;
						height = 30;
					}
					else if (size == 'middle') {
						width = 120;
						height = 60;
					}
					else {
						width = 240;
						height = 120;
					}
					context.strokeRect(x_axis-(width/2),y_axis-(height/2),width,height);
					break;
				case 1:
					var diameter = 0;
					if (size == 'small') {
						diameter = 20;
					}
					else if (size == 'middle') {
						diameter = 40;
					}
					else {
						diameter = 80;
					}
					context.beginPath();
            		context.arc(x_axis, y_axis, diameter, 0, Math.PI * 2, true);
   		          	context.closePath();
					context.stroke();
					break;
				case 2:
					var side = 0;
					if (size == 'small') {
						side = 20;
					}
					else if (size == 'middle') {
						side = 40;
					}
					else {
						side = 80;
					}
					context.moveTo(x_axis,y_axis-side);
					context.lineTo(x_axis-1.2*side,y_axis+(side/2));
					context.lineTo(x_axis+(1.7*3/4)*side,y_axis+(side/2));
					context.lineTo(x_axis,y_axis-side);
					context.stroke();
					break;
				case 3:
					var width = 0;
					var height = 0;
					if (size == 'small') {
						width = 50;
						height = 25;
					}
					else if (size == 'middle') {
						width = 140;
						height = 70;
					}
					else {
						width = 280;
						height = 140;
					}
					context.moveTo(x_axis-0.3*width,y_axis-0.5*height);
					context.lineTo(x_axis+0.7*width,y_axis-0.5*height);
					context.lineTo(x_axis+0.3*width,y_axis+0.5*height);
					context.lineTo(x_axis-0.7*width,y_axis+0.5*height);
					context.lineTo(x_axis-0.3*width,y_axis-0.5*height);
					context.stroke();
					break;
				case 4:
					var diameter = 0;
					if (size == 'small') {
						diameter = 20;
					}
					else if (size == 'middle') {
						diameter = 40;
					}
					else {
						diameter = 80;
					}
					context.beginPath();
            		context.arc(x_axis, y_axis, diameter, 0, Math.PI * 2, true);
					context.closePath();
					context.stroke();
					context.beginPath();
					context.moveTo(x_axis-0.75*diameter,y_axis-0.25*diameter);
					context.lineTo(x_axis-0.35*diameter,y_axis-0.25*diameter);
					context.moveTo(x_axis+0.75*diameter,y_axis-0.25*diameter);
					context.lineTo(x_axis+0.35*diameter,y_axis-0.25*diameter);
					context.closePath();
					context.stroke();
					context.beginPath();
					context.arc(x_axis, y_axis+0.2*diameter, 0.5*diameter, 0, Math.PI, false);
   		          	context.closePath();
					context.stroke();
					break;
			}
			editing = false;
		  	$('#canvas').addClass('draggable').removeClass('editable');
		  	removeEditingPrompt();
		}
	});
	$('#shape section button[name="cancel"]').click(function() {
	  if(editing) {
		  editing = false;
		  $('#canvas').addClass('draggable').removeClass('editable');
		  removeEditingPrompt();
	  }		
	});
	
	
  	/*				Paint				*/
	
	// paint options and preview
	
  	var previewCanvas = document.getElementById('previewCanvas');
	var previewContext = previewCanvas.getContext("2d");
	previewContext.font = "42px normal sans-serif";
	previewContext.fillText("Preview",85,90);
  	$('#paint input').click(function() {
		$('#paint input').attr('name','');
		$(this).attr('name','selected');
		previewContext.strokeStyle = $(this).css('background-color');
		$('#paint button[name="preview"]').click();
	});
	$('#paint button[name="preview"]').click(function() {
		previewContext.clearRect(0,0,previewCanvas.width,previewCanvas.height);
		previewContext.lineWidth = 	$('#paint select').val();
		previewContext.strokeRect(100,50,100,50);
	});
	
	// paint start and stop
	
	$('#paint button[name="paint"]').click(function() {
		editing = true;
		$('#canvas').removeClass('draggable').addClass('editable');
		$(this).hide();
		$('#paint button[name="stop"]').show();
		addEditingPrompt();
		new Draw();
	});
	$('#paint button[name="stop"]').click(function() {
		editing = false;
		$('#canvas').addClass('draggable').removeClass('editable');
		$(this).hide();
		$('#paint button[name="paint"]').show();
		removeEditingPrompt();
	});
	
	
	/*				Border				*/
	
	// vertical display
	verticalDisplay('border');
	
	// border style and start
	$('#border li').click(function() {
		$('#border li').attr('name','');
		$('#border li img').css('border','none');
		$(this).attr('name','selected');
		$(this).children('img').css('border','2px solid #000');
	});
	$('#border section button[name="add"]').click(function() {
		var x_axis = event.pageX - $(this).offset().left - ($('#text p').width()/2);
		var y_axis = event.pageY - $(this).offset().top;
		
		var frame = new Image();
		frame.width = canvas.width;
		frame.height = canvas.height;
		frame.src = $('#border li[name="selected"] img').attr('src');
		context.drawImage(frame,0,0,frame.width,frame.height);
		
	});
	
	
	
	/*********************************/
	/* 			Step 1 2 3			 */
	/*********************************/
	
	// dealing with buttons at the bottom
	
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