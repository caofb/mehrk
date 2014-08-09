define(['knockout','knockout.validation','app/Utils','jquery','lodash','ajaxify'], function(ko,validation,Utils,$,_,ajaxify) {
    return function LoginViewModel() {
    	var self=this;
    	self.username=ko.observable('').extend({
            required: {
                params: true,
                message: "用户名不能为空！"
            },
            minLength: {
                params: 3,
                message: "用户名至少包含3个字符！"
            }
        });
    	self.password=ko.observable('').extend({
            required: {
                params: true,
                message: "密码不能为空！"
            },
            minLength: {
                params: 6,
                message: "密码至少包含6个字符！"
            }
        });
        self.remember=ko.observable(true);
    	self.init=function(){
    		var utils=new Utils();
        	if (!utils.isBind('loginPage')) {
        		ko.applyBindings(self,document.getElementById('loginPage'));
        	};  		
    	}
    	self.loginUser=function(){
    		self.errors = ko.validation.group(self);
    		if(self.isValid()){
			   var loginData = {
					'username': self.username(),
					'password': self.password(),
					'remember': self.remember(),
					'_csrf': $('#csrf-token').val()
				},
				previousUrl = $('input[name="previousUrl"]').val();

			   $('#login').attr('disabled', 'disabled').html('登录中...');
			   $('#login-error-notify').hide();

			  $.ajax({
				type: "POST",
				url: '/login',
				data: loginData,
				success: function(data, textStatus, jqXHR) {
					if(data.code===200){
                       $('#login').html('跳转中...');
					   if (previousUrl) {
					   	  ajaxify.refreshHead();
					   	  ajaxify.go(previousUrl);
					   }					
                       else{
                       	 ajaxify.refreshHead();
                       	 ajaxify.go('');
                       }
					}
					else{
						var error= _.pluck(data.errors,'msg').join("</br>");
                        $('#login-error-notify').show().html(error);
					    $('#login').removeAttr('disabled').html('登录');
					}
					
				},
				error: function(data, textStatus, jqXHR) {
                    $('#login-error-notify').show().html("发生错误，请稍候重试！");
					$('#login').removeAttr('disabled').html('登录');
				},
				dataType: 'json',
				async: true
			  });
    		}
    		else
    			self.errors.showAllMessages();
    	}
    };
});