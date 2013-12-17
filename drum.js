var app;

function bind(scope,func){
	return function(){
		func.apply(scope,arguments)
	}
}

$(document).ready(function(){
	app = new application();

	 $('#name').keydown(function(event){
	    if(event.keyCode == 13) {
	      event.preventDefault();
	      $('#name').blur();
	      app.activateButtons();
	      app.drawText();
	      return false;
	    }
	  });

	 $('#name').blur(function(){
  		var name = document.getElementById('name');
		if(name.value.length > 0)app.activateButtons();
		else app.deactivateButtons();

	})

	 $('<span style="color: #FF0000;">*</span>').insertAfter('#idName');
});


var button = function(position,ctx,barWidth){
	this.position = position;
	this.ctx = ctx;
	this.isCollided = false;
	this.drawCount = 0;
	this.height = 15;
	this.width  = 15;
	//this.position.x = this.position.x + barWidth;

	this.draw = function(){
		this.ctx.beginPath();
		this.ctx.fillStyle = '#428bca';
		this.ctx.fillRect(this.position.x+this.barWidth+50,this.position.y,this.width,this.height);
		this.ctx.fill();
		this.ctx.closePath();
		this.drawCount = 0;
	}

	this.reDraw = function(){
		this.ctx.beginPath();
		this.ctx.fillStyle = '#3276b1';
		this.ctx.fillRect(this.position.x+this.barWidth+50,this.position.y,this.width,this.height);
		this.ctx.fill();
		this.ctx.closePath();
		this.drawCount = 1;
	}

	this.clearDraw = function(){
		this.ctx.clearRect(this.position.x+this.barWidth+50,this.position.y,this.width,this.height);

	}

	this.collides = function (x,y) {
		console.log(x,y);
	    var left = this.position.x, right = this.position.x+this.width;
	    var top = this.position.y, bottom = this.position.y+this.height;
	    if (right >= x&& left <= x&& bottom >= y && top <= y){
	    	
	    	this.clearDraw();
	    	console.log("hit")
	    }
	    else{
	    
	    }
	 
	}


}

var application = function(){
	
	var canvas = $("#canvas")[0];
	var ctx  = canvas.getContext("2d");
	var bars = new Array();
	this.placePosition = 90;
	var totalbars = 0;
	var image = null;
	var barWidth = 200;
	var totalButtons = new Array();

	$(".loading-gif").hide();
	$( "#canvas" ).mousedown(function(e) {
  		for (var i = 0; i < bars.length; i++) {
  			bars[i].check(e.offsetX,e.offsetY);
  		};
  		e.preventDefault();
	});


	$( "#canvas" ).mousemove(function(e) {
		for (var i = 0; i < totalButtons.length; i++) {
			totalButtons[i].collides();
		};
  		e.preventDefault();
	});



	this.deactivateButtons = function(){
	  var buttons = document.getElementById('buttonGroup');
      for(x in buttons.children){
      	   buttons.children[x].disabled = true;
      	  if(buttons.children[x].id == "linkImage")buttons.children[x].className = "btn btn-primary disabled";
      }
	}

	this.activateButtons = function(){
	  var buttons = document.getElementById('buttonGroup');
      for(x in buttons.children){
      	   buttons.children[x].disabled = false;
      	  if(buttons.children[x].id == "linkImage")buttons.children[x].className = "btn btn-primary";
      }

      this.fillDownload();
	}

	this.fillDownload = function(){
		document.getElementById('linkImage').href = this.generateImage();
		document.getElementById('linkImage').download = document.getElementById('name').value;
	}

	this.drawText = function(){
		var canvas = $("#canvas")[0];
		var ctx  = canvas.getContext("2d");
		ctx.font="20px Georgia";
		ctx.clearRect(0,0,canvas.width,80);
		ctx.fillText(document.getElementById('name').value,10,50);
	}

	this.generateBar = function(){
		if(totalbars > 9*4)return;
		ctx  = canvas.getContext("2d");

		var p = new vector(barWidth*i+17,this.placePosition);
		
		for (var i = 0; i < 4; i++) {
			p = new vector(barWidth*i+17,this.placePosition);
			var drum = new drumBar(p,ctx,barWidth);
			drum.init();
			this.bars.push(drum);
			totalbars++;
		};

		this.placePosition += 150;
		canvas.height += 150;

		for (var i = 0; i < this.bars.length; i++) {
			this.bars[i].reDraw();
		};

		this.generatButton(p);

		for (var i = 0; i < totalButtons.length; i++) {
			totalButtons[i].draw();
		};
		this.drawText();
	}

	this.generatButton = function(p){
		var b = new button(p,ctx,barWidth);
		totalButtons.push(b);
	}
	
	this.bars = bars;
	this.generateBar();

	this.generateImage = function(){
		return canvas.toDataURL('png');
	}

	this.preview = function(){

		for (var i = 0; i < this.bars.length; i++) {
			this.bars[i].cleanDraw();
		};
		
		document.getElementById('noteImage').src = this.generateImage();
		document.getElementById('noteImage').width = canvas.width / 1.5;
		document.getElementById('noteImage').height = canvas.height / 1.5;

		for (var i = 0; i < this.bars.length; i++) {
			this.bars[i].reDraw();
		};
	}

	this.sendImage = function(){

		var email = document.getElementById('exampleInputEmail1');
		var filter =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
		if(email.value.length <= 0 || !filter.test(email.value)){
			alert('need valid email');
			return;
		}
		
		for (var i = 0; i < this.bars.length; i++) {
			this.bars[i].cleanDraw();
		};
		this.drawText();
		var dataURL = this.generateImage();
		var totaldata =  { data: dataURL,name:name.value,email:email.value};

		$(".loading-gif").show();
		$("#buttonclass").hide();
		
		$.ajax({
			url: "sendImage.php",
			type: "post",
			data: totaldata,
			success: function(e){
				$(".loading-gif").hide();
				$("#buttonclass").show();
				email.value = "";
				for (var i = 0; i < this.bars.length; i++) {
					this.bars[i].reDraw();
					};
			},
			error: function(errorThrown) {
  				console.log(errorThrown);
			}
		});
	}
	
	this.makepage = function (src)
	{
		return "<html>\n" +
		"<head>\n" +
		"<title>Temporary Printing Window</title>\n" +
		"<script>\n" +
		"function step1() {\n" +
		" setTimeout('step2()', 10);\n" +
		"}\n" +
		"function step2() {\n" +
		" window.print();\n" +
		" window.close();\n" +
		"}\n" +
		"</scr" + "ipt>\n" +
		"</head>\n" +
		"<body onLoad='step1()'>\n" +
		"<img src='" + src + "'/>\n" +
		"</body>\n" +
		"</html>\n";
	}

	this.printImage = function(){
		for (var i = 0; i < this.bars.length; i++) {
			this.bars[i].cleanDraw();
		};
		
		this.drawText();
		var dataURL = canvas.toDataURL();
		link = "about:blank";
		var pw = window.open(link, "_new");
		pw.document.open();
		pw.document.write(this.makepage(dataURL));
		pw.document.close();
		
		for (var i = 0; i < this.bars.length; i++) {
		 	this.bars[i].reDraw();
		};
	}
}

var placeNote = function(ctx,position,bar){
	this.ctx = ctx;
	this.position = position;
	this.isChanged = false;
	this.width = 10;
	this.height =10;
	this.bar = bar;
	this.typeNote = "";
	this.hitType = "";
	this.hihatsize = 3;
	this.offset = 4;
	this.clicked = 0;
	this.funcs = new Array();
	this.lineStartPosition = new vector(this.position.x+10,this.position.y);

	this.drawCircle = function(){
		this.ctx.beginPath();
		this.ctx.lineWidth=1;
		this.ctx.clearRect(this.position.x,this.position.y,this.width,this.height);
		this.ctx.fillStyle = '#000000';
		this.ctx.arc(this.position.x+5,this.position.y+5,4,0,2*Math.PI);
		this.ctx.fill();
		this.ctx.lineStyle = 'black';
		this.ctx.moveTo(this.position.x+10,this.position.y+5);
		this.ctx.lineTo(this.position.x+10,this.bar.startPosition.y-2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	this.drawHihat = function(){
		this.ctx.beginPath();
		this.ctx.lineWidth=1;
		this.ctx.lineStyle = 'black';
		this.ctx.moveTo(this.position.x-this.hihatsize+this.offset,this.position.y-this.hihatsize+this.offset);
		this.ctx.lineTo(this.position.x+this.hihatsize+this.offset,this.position.y+this.hihatsize+this.offset);
		this.ctx.moveTo(this.position.x-this.hihatsize+this.offset,this.position.y+this.hihatsize+this.offset);
		this.ctx.lineTo(this.position.x+this.hihatsize+this.offset,this.position.y-this.hihatsize+this.offset);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	this.drawCrash = function(){
		this.ctx.beginPath();
		this.ctx.lineWidth=1;
		this.ctx.lineStyle = 'black';
		this.ctx.moveTo(this.position.x-this.hihatsize+this.offset,this.position.y-this.hihatsize+this.offset);
		this.ctx.lineTo(this.position.x+this.hihatsize+this.offset,this.position.y+this.hihatsize+this.offset);
		this.ctx.moveTo(this.position.x-this.hihatsize+this.offset,this.position.y+this.hihatsize+this.offset);
		this.ctx.lineTo(this.position.x+this.hihatsize+this.offset,this.position.y-this.hihatsize+this.offset);

		this.ctx.moveTo(this.position.x+this.offset,this.position.y);
		this.ctx.lineTo(this.position.x+this.offset,this.position.y+this.hihatsize+this.offset+1);

		this.ctx.moveTo(this.position.x,this.position.y+this.hihatsize+1);
		this.ctx.lineTo(this.position.x+this.hihatsize+this.offset+1,this.position.y+this.hihatsize+1);
		
		this.ctx.stroke();
		this.ctx.closePath();
	}

	this.drawRect = function(){
		this.ctx.clearRect(this.position.x,this.position.y,this.width,this.height);
		this.ctx.beginPath();
		this.ctx.lineWidth=1;
		this.ctx.strokeRect(this.position.x,this.position.y,this.width,this.height);
		this.ctx.closePath();
	}

	this.init = function(typeNote,hitType){
		this.typeNote = typeNote;
		this.hitType = hitType;
		if(hitType == "hihat"){
			this.funcs.push(bind(this,this.drawRect),bind(this,this.drawHihat),bind(this,this.drawCrash));
		}else this.funcs.push(bind(this,this.drawRect),bind(this,this.drawCircle));

		this.draw();
	}

	this.draw = function(){
		this.funcs[this.clicked].call();
	}

	this.cleanDraw = function(){
		if(this.clicked != 0)this.funcs[this.clicked].call();
	}

	this.collides = function (x,y) {
	    var left = this.position.x, right = this.position.x+this.width;
	    var top = this.position.y, bottom = this.position.y+this.height;
	    if (right >= x&& left <= x&& bottom >= y && top <= y){
	    	if(!this.isChanged)this.isChanged = true;
	    	else if(this.isChanged)this.isChanged = false;
	    	
	    	if(this.typeNote != ""){
	    		this.clicked++;
	    		if(this.clicked > this.funcs.length-1)this.clicked = 0;
	    	}
	    	this.bar.reDraw();
	    	return true;
	    }
	    return false;
	}
}

var drumBar = function(position,ctx,barWidth){
	this.ctx = ctx;
	this.typeOfBar = 1;
	this.width = barWidth;
	this.startPosition = position;
	this.innerNotes = new Array();

	this.init = function(){
		var num = this.width / 8;
		for (var i = 1; i < 9; i++) {
	 		this.innerNotes[i] = new Array();
	 		for (var j = 0; j < 6; j++) {
	 			var position = new vector(num*i+this.startPosition.x-20,15*j+this.startPosition.y-2+this.getoffSetPosition(j));
	 			var pl =  new placeNote(this.ctx,position,this);

   				if(i % 2 == 0){
   					if(j == 0)pl.init("1/8","hihat");
   					else pl.init("1/8","");
	 			}else{
	 				if(j == 0)pl.init("1/4","hihat");
   					else pl.init("1/4","");
	 			} 
   				this.innerNotes[i][j] = pl;
	 		};
		}
		this.draw();
	}

	this.getoffSetPosition = function(index){
		switch(index){

			case 0:
			return 0;

			case 1:
			return 7;
		
			case 2:
			return 7;

			case 3:
			return 7;

			case 4:
			return 7;

			case 5:
			return 5;
		}
	}

	this.check = function(x,y){
		for (var i = 1; i < this.innerNotes.length; i++) {
			for (var j = 0; j < this.innerNotes[i].length; j++) {
				var bool = this.innerNotes[i][j].collides(x,y);
			};	
		};
	}

	this.linkNotes = function(){
		for (var i = 1; i < this.innerNotes.length; i++) {
			for (var j = 0; j < this.innerNotes[i].length; j++) {
				    var note = this.innerNotes[i][j];
				    if(note.hitType == "hihat")continue;
					if(note.isChanged && note.typeNote == "1/4"){
						for (var x = 0; x < 6; x++) {
							 var other = this.innerNotes[i+1][x];
							 if(other.hitType == "hihat")continue;
							 if(other.isChanged){
								this.ctx.beginPath();
								this.ctx.lineWidth = 5;
							 	this.ctx.moveTo(note.lineStartPosition.x-1,note.bar.startPosition.y);
						   		this.ctx.lineTo(other.lineStartPosition.x+1,other.bar.startPosition.y);
						   		this.ctx.stroke();
								this.ctx.closePath();

							 }
						};
					}
			};
		}
	}

	this.reDraw = function(){
		this.ctx.clearRect(this.startPosition.x,this.startPosition.y-10,this.width+1,100);
		for (var i = 1; i < this.innerNotes.length; i++) {
			for (var j = 0; j < this.innerNotes[i].length; j++) {
				this.innerNotes[i][j].draw();
			}
		}
		this.draw();
	}

	this.cleanDraw = function(){
		this.ctx.clearRect(this.startPosition.x,this.startPosition.y-10,this.width+1,100);
		this.ctx.beginPath();
		for (var i = 0; i < 5; i++) {
		 	this.ctx.lineWidth=2
		 	this.ctx.lineStyle = 'black';
		 	this.ctx.moveTo(this.startPosition.x,15*i+this.startPosition.y+11);
		 	this.ctx.lineTo(this.startPosition.x + this.width,15*i+this.startPosition.y+11);
		 	this.ctx.stroke();
		 }

		this.ctx.moveTo(this.startPosition.x + this.width,this.startPosition.y+11);
		this.ctx.lineTo(this.startPosition.x + this.width,this.startPosition.y+71);
		this.ctx.stroke();
		this.ctx.closePath();
		this.linkNotes();
		for (var i = 1; i < this.innerNotes.length; i++) {
			for (var j = 0; j < this.innerNotes[i].length; j++) {
				this.innerNotes[i][j].cleanDraw();
			}
		}
	}
	
	this.draw = function(){
		this.ctx.beginPath();
		for (var i = 0; i < 5; i++) {
		 	this.ctx.lineWidth=2
		 	this.ctx.lineStyle = 'black';
		 	this.ctx.moveTo(this.startPosition.x,15*i+this.startPosition.y+11);
		 	this.ctx.lineTo(this.startPosition.x + this.width,15*i+this.startPosition.y+11);
		 	this.ctx.stroke();
		 }
		this.ctx.moveTo(this.startPosition.x + this.width,this.startPosition.y+11);
		this.ctx.lineTo(this.startPosition.x + this.width,this.startPosition.y+71);
		this.ctx.stroke();
		this.ctx.closePath();
		this.linkNotes();
	}
}
