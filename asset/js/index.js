	
	var Vadm = {};
	
	Vadm.button = function(){
		$('.form-submit').die('click').live('click',function(){
		
			var form = $($(this).attr('data-form'));
			if(!form.length) throw 'The form '+$(this).data('data-form')+'does not exist';
			if(!$(this).attr('data-callback')) throw 'The element does not have any callback';
			
			var func = function(){return true;};
			var callb = window[$(this).attr('data-callback')];
			if($(this).attr('data-function')) func = window[$(this).attr('data-function')];
			
			for(var i in par) psr[i] = window[par[i]];
			
			if(Vadm.form.validate(form) && func()){
				(Vadm.form.isupload() && Vadm.form.upload()) ||
				Vadm.form.submit();
			}
		
		});
	
		$('[data-loading-text]').button();
	}
	
	Vadm.navbar = function(){
		$('#navbar_content a').die('click')
		.live('click',function(e){
			e.preventDefault();
			$('#navbar_content a').removeClass('active');
			$(this).addClass('active');
			Modul.showPage($(this).attr('href'));
		});
	}
	
	function Init(){
		Modul.start();
		Vadm.button();
		Vadm.navbar();
		$.hashaware();
	}


	$(function(){
		$('body').unbind('api.error').bind('api.error',function(e,d){
			$.modal.error(d);
		}).unbind('hashchange').bind('hashchange',function(e,d){
			Modul.load(d);
		});
		
		Init();
	});
	
	
	
	
