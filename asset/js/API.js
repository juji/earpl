	var Api = {};
	
	Api.host = Site.protocol + '://' + Site.host;
	Api.base = '/api/';
	
	Api.xhr = false;
	
	Api.sendUpload = function(form,url,callback,par){
		
		form.attr('enctype','multipart/form-data');
		form.attr('target','frameupload');
		form.attr('method','post');
		form.attr('action',Api.host + Api.base + url);
		$('body').append('<iframe src="javascript:true;" style="display:none;" id="frameupload" name="frameupload"></iframe>');
		
		if(!par) par = [];
		if(par && par.constructor!==Array) par = [par];
		
		$('#frameupload').load(function(){
			var html = $(this).contents().find('body').html();
			if(!html) return;
			try{
				html = $.parseJSON(html);
				Api.callback(html,callback,par);
			}catch(e){
				if(callback) callback.apply(this,$.merge([false],par));
				Api.error('Parse error:<br />'+html);
			}
			
			$('#frameupload').remove();
		});
		
		form.submit();
	}
	
	Api.send = function(meth,url,data,callback,par){
		if(!par) par = [];
		if(par && par.constructor!==Array) par = [par];
		//Api.xhr = 
		$.ajax({
			"type": meth,
			"url" : Api.host + Api.base + url,
			'data': data,
			'success' : function(d){
				Api.callback(d,callback,par);
				//Api.xhr = false;
			},
			'error': function(xhr,text,e){
				if(callback) callback.apply(this,$.merge([false],par));
				if(xhr.status!=200)
				Api.error('Hei.. check your internet connection.. :). If it\'s good, call developer.');
				else 
				Api.error('Hei, something bad happened: '+text);
				
				throw (xhr.responseText);
			}
		});
	}
	
	Api.callback = function(data,callb,pars){
		if(typeof data != 'object') {
			if(callb) callb.apply(this,$.merge([false],pars));
			Api.error(data);
		}
		
		if(typeof data.status !='undefined' && data.status){
			if(callb) callb.apply(this,$.merge([data.message],pars));
		}else{
			if(callb) callb.apply(this,$.merge([false],pars));
			if(typeof data.message !='undefined') Api.error(data.message);
			else Api.error('Data Error:<br />'+data);
		}
	}
	
	Api.json = function(str){
		if(str.match(/^\{"([^"]*?"\:.*?(,"|))+\}$/)){
			return $.parseJSON(str);
		}else{
			return false;
		}
	}
	
	Api.error = function(str){
		
		$('body').trigger('api.error',[str]);
		
	}