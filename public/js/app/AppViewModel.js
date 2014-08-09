define(['knockout','jquery','knockout','app/Utils','ajaxify'], function(ko,$,ko,Utils,ajaxify) {
    return function AppViewModel() {
    	var self=this;
    	self.init=function(){
        	var utils=new Utils();
        	if (!utils.isBind('head-bar')) {
        		ko.applyBindings(self,document.getElementById('head-bar'));
        	};
    		
    	};
    	self.logoutUser=function(){
			   $.post( '/logout', {
			      _csrf: $('#csrf_token').val()
		       }, function() {
			     ajaxify.refreshHead();
		       });  		
    	}
    };
});