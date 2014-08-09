define(['knockout'], function(ko) {
    return function Utils() {
    	var self=this;
    	self.isBind = function(id) {
           return !!ko.dataFor(document.getElementById(id));
        };  
    };
});