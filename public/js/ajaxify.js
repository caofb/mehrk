"use strict";

define(['knockout','jquery','handlebars','templates'], function(ko,$,Handlebars,templates){
    var ajaxify = ajaxify || {};
    var app;
	var location = document.location || window.location,
		rootUrl = location.protocol + '//' + (location.hostname || location.host) + (location.port ? ':' + location.port : ''),
		apiXHR = null,
        PRELOADER_RATE_LIMIT = 10000;
	window.onpopstate = function (event) {
		if (event !== null && event.state && event.state.url !== undefined) {
			ajaxify.go(event.state.url, function() {}, true);
		}
	};

	ajaxify.currentPage = null;
    ajaxify.preloader = {};
    ajaxify.previousUrl = null;

	function onAjaxError(err, url) {
		var data = err.data, textStatus = err.textStatus;

		$('#content, #footer').removeClass('ajaxifying');

		if (data) {
			if (data.status === 404) {
				return ajaxify.go('404');
			} else if (data.status === 403) {
				return ajaxify.go('/login?next='+url);
			} else if (data.status === 302) {
				return ajaxify.go(data.responseJSON.slice(1));
			}
		} else if (textStatus !== "abort") {
			app.alertError(data.responseJSON.error);
		}
	}
    ajaxify.go = function (url, callback, quiet) {
		// "quiet": If set to true, will not call pushState

		$(window).off('scroll');

		if ($('#content').hasClass('ajaxifying') && apiXHR) {
			apiXHR.abort();
		}

		// Remove trailing slash
		url = url.replace(/\/$/, "");
        url = url.replace(/^\//, "");
		var tpl_url = ajaxify.getTemplateMapping(url);


		if (ajaxify.isTemplateAvailable(tpl_url)) {
			ajaxify.currentPage = url;

			if (window.history && window.history.pushState) {
				window.history[!quiet ? 'pushState' : 'replaceState']({
					url: url 
				}, url, '/' + url );
			}

			$('#footer, #content').removeClass('hide').addClass('ajaxifying');
			var animationDuration = parseFloat($('#content').css('transition-duration')) || 0.2,
				startTime = (new Date()).getTime();

			ajaxify.loadData(url, function(err, data) {
				if (err) {
					return onAjaxError(err, url);
				}
                var template = templates[tpl_url](data);
				setTimeout(function() {

					$('#content').html(template);

					ajaxify.loadScript(tpl_url);

					if (typeof callback === 'function') {
						callback();
					}

					setTimeout(function () {
			                window.scrollTo(0, 1); // rehide address bar on mobile after page load completes.
		            }, 100);

					$('#content, #footer').removeClass('ajaxifying');

					window.document.title = data.title||'mehrk';

				}, animationDuration * 1000 - ((new Date()).getTime() - startTime))
			});

			return true;
		}

		return false;
	};
	ajaxify.refreshHead=function(){
		$.ajax({
			url: '/api/head',
			success: onHeadLoad,
			async: false
		});
	}
	function onHeadLoad(data){
		var template = templates["partials/head"](data);
		$('#header-menu').html(template);
        app.init();
	}
	ajaxify.refresh = function() {
		ajaxify.go(ajaxify.currentPage);
	};

	ajaxify.loadScript = function(tpl_url, callback) {
		if(tpl_url==="403"||tpl_url==="404"||tpl_url==="500")
			return;
		require(['app/' + tpl_url+"ViewModel"], function(ViewModel) {
			var script=new ViewModel();
			if (script && script.init) {
				script.init();
			}           
			if (callback) {
				callback();
			}
		}, function (err) {
           console.log(err);
        });
	};

	ajaxify.isTemplateAvailable = function(tpl) {
		return templates[tpl];
	};

	ajaxify.getTemplateMapping = function(url) {
		var tpl_url = false;

		if ( !templates[url]) {
			if (url === '' || url === '/') {
				tpl_url = 'home';
			}  else {
				tpl_url = url.split('/');

				while(tpl_url.length) {
					if (ajaxify.isTemplateAvailable(tpl_url.join('/'))) {
						tpl_url = tpl_url.join('/');
						break;
					}
					tpl_url.pop();
				}

				if (!tpl_url.length) {
					tpl_url = url.split('/')[0].split('?')[0];
				}
			}
		} else if (templates[url]) {
			tpl_url = url;
		}

		return tpl_url;
	};


	ajaxify.loadData = function(url, callback) {

		if (ajaxify.preloader && ajaxify.preloader[url]) {
			callback(null, ajaxify.preloader[url].data);
			ajaxify.preloader = {};

			return;
		}

		var location = document.location || window.location,
			api_url = (url === '' || url === '/') ? 'home' : url,
			tpl_url = ajaxify.getTemplateMapping(url);

		apiXHR = $.ajax({
			url:  '/api/' + api_url,
			cache: false,
			success: function(data) {
				if (!data) {
					ajaxify.go('404');
					return;
				}

				if (callback) {
					callback(null, data);
				}
			},
			error: function(data, textStatus) {
				callback({
					data: data,
					textStatus: textStatus
				});
			}
		});
	};
    ajaxify.init=function(appViewModel){
      $('document').ready(function () {
		if (!window.history || !window.history.pushState) {
			return; // no ajaxification for old browsers
		}
        function hrefEmpty(href) {
				return href === 'javascript:;' || href === window.location.href + "#" || href.slice(-1) === "#";
		}
		// Enhancing all anchors to ajaxify...
		$(document.body).on('click', 'a', function (e) {
			

			if (hrefEmpty(this.href) || this.target !== '' || this.protocol === 'javascript:') {
				return;
			}

			if(!window.location.pathname.match(/\/(403|404)$/g)) {
				ajaxify.previousUrl = window.location.href;
			}

			if ($(this).attr('data-ajaxify') === 'false') {
				return;
			}

			if ((!e.ctrlKey && !e.shiftKey && !e.metaKey) && e.which === 1) {
				if (this.host === window.location.host) {
					// Internal link
					var url = this.href.replace(rootUrl + '/', '');

					if(window.location.pathname === this.pathname && this.hash) {
						if (this.hash !== window.location.hash) {
							window.location.hash = this.hash;
						}

						ajaxify.loadScript(ajaxify.getTemplateMapping(url));
						e.preventDefault();
					} else {
						if (ajaxify.go(url)) {
							e.preventDefault();
						}
					}
				} else {
					// External Link
					window.open(this.href, '_blank');
					e.preventDefault();
				}
			}
		});

        $(document.body).on('mouseover', 'a', function (e) {
			if (hrefEmpty(this.href) || this.target !== '' || this.protocol === 'javascript:' || $(this).attr('data-ajaxify') === 'false') {
				return;
			}

			if (this.host === window.location.host) {
				// Internal link
				var url = this.href.replace(rootUrl + '/', ''),
					currentTime = (new Date()).getTime();

				if (!ajaxify.preloader[url] || currentTime - ajaxify.preloader[url].lastFetched > PRELOADER_RATE_LIMIT) {
					ajaxify.preloader[url] = null;
					ajaxify.loadData(url, function(err, data) {
						ajaxify.preloader[url] = err ? null : {
							url: url,
							data: data,
							lastFetched: currentTime
						};
					});
				}
			}

		});
		if (window.history && window.history.replaceState) {
				var hash = window.location.hash ? window.location.hash : '';
				var url = window.location.pathname.slice(1);
				window.history.replaceState({
					url: url + hash
				}, url,  '/' + url + hash);
		}
		ajaxify.loadScript(ajaxify.getTemplateMapping(window.location.pathname.slice(1).replace(/\/$/, "")));
        app=appViewModel;
        app.init();
	  });
    }

	
    return ajaxify;
});
