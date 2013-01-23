	
	var Modul = {};
	Modul.current = false;
	Modul.xhr = false;
	Modul.aborted = false;
	
	Modul.query = '';
	Modul.hash = '';
	
	Modul.host = Site.protocol + '://' + Site.host;
	Modul.base = '/modul/';
	
	Modul.container = false;
	Modul.loader = false;
	
	Modul.load = function(href){
		href = href.replace(/^\#\!\//,'');
		
		if(Modul.xhr) Modul.abort();
		Modul.current = false;
		
		Modul.loadStart();
		Modul.xhr = $.ajax({
			type:'get',
			url:Modul.host + Modul.base + href,
			success:function(html){
				Modul.loadEnd();
				Modul.draw(html);
				Modul.xhr = false;
				Modul.current = href;
			},
			error: function(xhr,status,err){
				Modul.loadEnd();
				if(Modul.aborted) {
					Modul.aborted = false;
					return;
				}
				Modul.xhr = false;
				Modul.current = false;
				Modul.draw('<span class="label label-important">'+
				'Whoaa.. We can\'t fetch the module. Something is wrong..'+
				'</span>');
			}
		});
	};
	
	Modul.start = function(){
		
		Modul.container = $('#modul_container');
		Modul.loader = $('img#loader');
		
		//read URL fragment
		var hash = window.location.hash.split('|');
		if(hash.constructor != Array) hash = [hash];
		if(hash.length == 2) Modul.query = hash[1];
		Modul.hash = hash[0];
		
		//parse menu for href & trigger click event
		$('#admmenu a').removeClass('active');
		var btn = $('#admmenu a[href~="'+Modul.hash+'"]');
		console.log(btn.parent().parent().parent());
		if(btn.parent().parent().parent().is('li'))
		btn.parent().parent().prev().click();
		btn.click();
		$('body').trigger('hashchange',[Modul.hash]);
		
	}
	
	Modul.loadEnd = function(){
		Modul.loader.hide('slow',function(){
			Modul.container.fadeTo(0,0).show().fadeTo('slow',1);
		});
	}
	
	Modul.loadStart = function(){
		Modul.container.hide('fast');
		Modul.loader.show('slow');
	}
	
	Modul.reset = function(){
		
		Modul.start();
		
	}
	
	Modul.abort = function(){
		
		Modul.aborted = true;
		Modul.xhr.abort();
		
	}
	
	Modul.draw = function(html){
		
		$('body').unbind('Modul.ready')
		.bind('Modul.ready',function(){
			Modul.activate();
		});
		
		$('#modul_container').html(html);
		
	}
	
	Modul.activate = function(){
		
		Modul.initialize();
		if(Modul.query){
			Modul.showPage(Modul.query);
		}	
		$('.modul-selector').unbind('click').click(function(e){
			if($(this).is('btn-primary')){return false;}
			Modul.showPage($(this).attr('href'));
		});
	}
	
	Modul.showPage = function(h){
		Modul.query = h.replace(/^\#/,'');
		window.location.hash = Modul.hash + '|' + Modul.query;
		Modul.initialize();
		$('.modul-page:not(#'+Modul.query+')').hide('fast');
		$('.modul-page#'+Modul.query).show('fast');
		
		$('.modul-selector').removeClass('btn-primary');
		$('.modul-selector[href="'+h+'"]').addClass('btn-primary');
	}
	
	Modul.initialize = function(){
		$('.modul-page').each(function(){
			($(this).data('html') && $(this).html($(this).data('html'))) ||
			$(this).data('html',$(this).html());
		});
	}
