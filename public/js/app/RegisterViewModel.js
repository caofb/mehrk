define(['knockout','jquery','app/Utils','ajaxify','lodash','knockout.validation'], function(ko,$,Utils,ajaxify,_) {
    return function RegisterViewModel() {
    	var self=this;
    	self.username=ko.observable('').extend({
            required: {
                params: true,
                message: "用户名不能为空！"
            },
            minLength: {
                params: 3,
                message: "用户名至少包含3个字符！"
            },
            maxLength: {
                params: 20,
                message: "用户名最多包含20个字符！"
            },
            validation: {
              async: true,
              validator: function (val, params, callback) {
                var options = {
                    url: 'api/chackname',
                    type: 'GET',
                    data: {username:val},
                    success: function(data, textStatus, jqXHR) {
                        if(data.isExist)
                        {
                            callback(false);
                        }
                        else{
                            callback(true);
                        }
                    },
                    error: function(data, textStatus, jqXHR) {
                        callback(false);
                    }
                };
                $.ajax(options);
              },
              message: '用户名已被使用！'
            }
        });
        self.email=ko.observable('').extend({
            required: {
                params: true,
                message: "Email不能为空！"
            },
            email: {
                params: true,
                message: "邮箱格式不正确！"
            },
            validation: {
              async: true,
              validator: function (val, params, callback) {
                var options = {
                    url: 'api/chackemail/',
                    type: 'GET',
                    data: {email:val},
                    success: function(data, textStatus, jqXHR) {
                        if(data.isExist)
                        {
                            callback(false);
                        }
                        else{
                            callback(true);
                        }
                    },
                    error: function(data, textStatus, jqXHR) {
                        callback(false);
                    }
                };
                $.ajax(options);
              },
              message: '邮箱已被使用！'
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
        self.confirmPassword=ko.observable('').extend({
            equal: {
                params: self.password,
                message: "输入密码不一致！"
            }
        });
        self.init=function(){
        	var utils=new Utils();
        	if (!utils.isBind('registerPage')) {
        		ko.applyBindings(self,document.getElementById('registerPage'));
        	};
    		
    	};
    	self.registerUser=function(){
    		self.errors = ko.validation.group(self);
    		if(self.isValid()){
    			var registerData = {
					'username': self.username(),
					'password': self.password(),
					'confirmPassword': self.confirmPassword(),
					'email':self.email(),
					'_csrf': $('#csrf-token').val()
				};

			  $('#register').attr('disabled', 'disabled').html('注册中...');
			  $('#register-error-notify').hide();

			  $.ajax({
				type: "POST",
				url: '/register',
				data: registerData,
				success: function(data, textStatus, jqXHR) {
                    if(data.code===200){
                       ajaxify.refreshHead();				
                       ajaxify.go('');
					}
					else{
						var error= _.pluck(data.errors,'msg').join("</br>");
                        $('#register-error-notify').show().html(error);
					    $('#register').removeAttr('disabled').html('注册');
					}
				},
				error: function(data, textStatus, jqXHR) {
					// Update error text
                    $('#register-error-notify').show().html('发生错误，请稍候重试！');
					$('#register').removeAttr('disabled').html('注册');
				},
				dataType: 'json',
				async: true
			  });
    		}
    		else
    			self.errors.showAllMessages();
    	};
    	
    };
});