var Modalbox = {};

Modalbox.getHTML = function (title,str,color,button){
	if(!color) color = '';
	if(typeof button=='undefined') button = '<a class="ModalBox_bttn '+color+'" href="javascript:Modalbox.remove();">ok</a>';
	
	var html = '<div class="ModalBox '+color+'">'+
		'<div class="ModalBox_tri"></div>'+
		'<div class="ModalBox_title">'+
			'<span class="ModalBox_titletext" style="float:left;">'+title+'</span>'+
			'<a href="javascript:Modalbox.remove();" class="ModalBox_close" style="float:right;">&#10006;</a>'+
			'<div style="clear:both;"></div>'+
		'</div>'+
		'<div class="ModalBox_content">'+str+'</div>'+
		'<div class="ModalBox_buttons">'+button+'</div>'+
	'</div>';
	
	return '<div class="ModalBox_BG"></div>'+html;
}


Modalbox.remove = function(){
	$('.ModalBox_BG').fadeTo('fast',0,function(){$('.ModalBox_BG').remove();});
	$('.ModalBox').hide('fast',function(){$('.ModalBox,.ModalBox_BG').remove();});
}

Modalbox.show = function(){
	var h = $('.ModalBox').height()*1;
	var w = $('.ModalBox').width()*1;
	
	if(!(h && w)) {
		setTImeout(function(){Modalbox.show();},200);
		return;
	}
	
	var topn = ($(window).height()/2) - (h/2);
	var leftn = ($(window).width()/2) - (w/2);
	var topp = (topn-100);
	
	$('.ModalBox').fadeTo(0,0).css({
		'top':topp+'px',
		'left':leftn+'px'
	});
	
	
	$('.ModalBox_content').css({'width':$('.ModalBox_content').width()+'px'})
	$('.ModalBox_content').fadeTo(0,0);
	$('.ModalBox_buttons').slideUp(0);
	$('.ModalBox_buttons a').fadeTo(0,0);
	$('.ModalBox_BG').fadeTo(0,0);
	$('.ModalBox_BG').show(0);
	
	$('.ModalBox_content').slideUp(0);
	$('.ModalBox_BG').fadeTo('fast',1);
	$('.ModalBox').animate({'top':topn+'px','opacity':1},'fast',function(){
		$('.ModalBox_content').slideDown('fast');
		$('.ModalBox_content').fadeTo('fast',1);
		$('.ModalBox_buttons').slideDown('fast',function(){
			$('.ModalBox_buttons a').fadeTo('normal',1);
		});
	});
}


$.modal={
	error : function(str){
		if($('.ModalBox').length) $('.ModalBox').remove();
		$('body').append( Modalbox.getHTML('Error!!',str,'red') );
		Modalbox.show();
	},
	
	ok: function(str){
		if($('.ModalBox').length) $('.ModalBox').remove();
		$('body').append( Modalbox.getHTML('Success..',str,'green') );
		Modalbox.show();
	},
	
	note: function(str){
		if($('.ModalBox').length) $('.ModalBox').remove();
		$('body').append( Modalbox.getHTML('Notification',str,'blue') );
		Modalbox.show();
	},
	ask: function(str,callback,par,text){
		if($('.ModalBox').length) $('.ModalBox').remove();
		if(!callback) {throw 'Modalbox returning, no callback on "ask", use "note" instead'; return;}
		if(callback.constructor != Function) {throw 'Modalbox returning, callback is not a function on "ask", please put function'; return;}
		if(!par) par = [];
		if(par.constructor != Array) par = [par];
		if(!text) text = 'proceed';
		
		var col = 'blue';
		
		var bttn = '<a class="ModalBox_bttn '+col+
		'" id="Modalbox_ask_OKbttn" href="javascript:void(0);">'+text+
		'</a>&nbsp; &nbsp;<a class="ModalBox_bttn '+col+
		'" href="javascript:Modalbox.remove();">cancel</a>';
		
		$('body').append( Modalbox.getHTML('Please Confirm..',str,col,bttn) );
		
		$('#Modalbox_ask_OKbttn').click(function(){
			Modalbox.remove();
			callback.apply(this,par);
		});
		Modalbox.show();
	},
	
	custom: function(title,str,bttn,color){
		if($('.ModalBox').length) $('.ModalBox').remove();
		
		if(!bttn) {throw 'Modalbox returning, no bttn on "box", use "note" or "ask" instead'; return;}
		if(!color) color = 'blue';
		
		var btn = '';
		for(var i in bttn){
			btn += '<a class="ModalBox_bttn '+color+'" href="javascript:'+(bttn[i].action)+';">'+(bttn[i].text)+'</a>&nbsp; &nbsp;';
		}
		
		btn += '<a class="ModalBox_bttn '+color+'" href="javascript:Modalbox.remove();">cancel</a>';
		
		$('body').append( Modalbox.getHTML(title,str,color,btn) );
		Modalbox.show();
	},
	
	loading : function(title,str,color){
		if(!color) color = 'blue';
		$('body').append( Modalbox.getHTML(title,str,color,'') );
		Modalbox.show();
	},
	
	iframe: function(title,url,color){
		if(!color) color = 'blue';
		$('body').append( Modalbox.getHTML(title,
		'<iframe src="'+url+'" style="border:none;width:400px;height:460px;"></iframe>',
		color,'') );
		Modalbox.show();z
	},
	
	close: function(){Modalbox.remove();}
}