define(['knockout','jquery','app/Utils','lodash','knockout.validation'], function(ko,$,Utils,_) {
    return function EditViewModel() {
    	var self=this;
    	self.init=function(){
        	var utils=new Utils();
        	if (!utils.isBind('account_edit')) {
        		ko.applyBindings(self,document.getElementById('account_edit'));
        	};
    		
    	};
    	self.currentPassword=ko.observable('').extend({
            required: {
                params: true,
                message: "密码不能为空！"
            },
            minLength: {
                params: 6,
                message: "密码至少包含6个字符！"
            }
        });
        self.newPassword=ko.observable('').extend({
            required: {
                params: true,
                message: "密码不能为空！"
            },
            minLength: {
                params: 6,
                message: "密码至少包含6个字符！"
            }
        });
        self.newConfirmPassword=ko.observable('').extend({
            equal: {
                params: self.newPassword,
                message: "输入密码不一致！"
            }
        });
        self.changePassowrd=function(){
    		self.errors = ko.validation.group(self);
    		if(self.isValid()){
    			var registerData = {
					'currentPassword': self.currentPassword(),
					'newPassword': self.newPassword(),
					'newConfirmPassword': self.newConfirmPassword(),
					'_csrf': $('#csrf-token').val()
				};
              $('#changePasswordBtn').attr('disabled', 'disabled').html('更改密码中...');
			  $('#changePassword-error-notify').hide();
			  $.ajax({
				type: "POST",
				url: '/api/account/changePassowrd',
				data: registerData,
				success: function(data, textStatus, jqXHR) {
                    if(data.code===200){
                       $('#changePassword-success-notify').show();
					}
					else{
						var error= _.pluck(data.errors,'msg').join("</br>");
                        $('#changePassword-error-notify').show().html(error);					    
					}
					$('#changePasswordBtn').removeAttr('disabled').html('更改密码');
				},
				error: function(data, textStatus, jqXHR) {
					// Update error text
                    $('#changePassword-error-notify').show().html('发生错误，请稍候重试！');
					$('#changePasswordBtn').removeAttr('disabled').html('更改密码');
				},
				dataType: 'json',
				async: true
			  });
    		}
    		else
    			self.errors.showAllMessages();
    	};
    	ko.bindingHandlers.initializeValue = {
           init: function(element, valueAccessor) {
             valueAccessor()(element.getAttribute('value'));
            },
           update: function(element, valueAccessor) {
              var value = valueAccessor();
              element.setAttribute('value', ko.utils.unwrapObservable(value))
            }
        };
        
    	self.location=ko.observable();
    	self.website=ko.observable();
    	self.signature=ko.observable();
    	self.changeProfile=function(){
    		  var registerData = {
					'location': self.location(),
					'website': self.website(),
					'signature': self.signature(),
					'_csrf': $('#csrf-token').val()
				};
              $('#changeProfileBtn').attr('disabled', 'disabled').html('保存修改中...');
			  $('#changeProfile-error-notify').hide();
			  $.ajax({
				type: "POST",
				url: '/api/account/changeProfile',
				data: registerData,
				success: function(data, textStatus, jqXHR) {
                    if(data.code===200){
                       $('#changeProfile-success-notify').show();
					}
					else{
						var error= _.pluck(data.errors,'msg').join("</br>");
                        $('#changeProfile-error-notify').show().html(error);					    
					}
					$('#changeProfileBtn').removeAttr('disabled').html('保存修改');
				},
				error: function(data, textStatus, jqXHR) {
					// Update error text
                    $('#changeProfile-error-notify').show().html('发生错误，请稍候重试！');
					$('#changeProfileBtn').removeAttr('disabled').html('保存修改');
				},
				dataType: 'json',
				async: true
			  });

    	};
    };
});