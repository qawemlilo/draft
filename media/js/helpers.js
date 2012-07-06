var Message = {

    messages: [],
	
	flag: false,

    getFlag: function () { 
        return this.flag;		
	},
	
    notice: function (msg, x) {
        this.messages.push(msg);
		
		if ($("#appMessage")) {
			$("#appMessage").fadeOut(function(){
				$("#appMessage").remove();
			});
		}
		
		var elem = $('<div>', {'id': 'appMessage', 'class': 'error', html: msg});
		
		elem.click(function () {
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
		
		if (x) {
		    setTimeout(function () {
			    elem.click();
		    }, x);
	    }
		else {
		    setTimeout(function () {
			    elem.click();
		    }, 2000);
		}
        		
		elem.hide().appendTo('body').slideDown();
    },	
	
    inline: function (data) {
        $(data).fancybox({
		      overlayOpacity: '0.0'
        });
	},
	
    confirm: function (o) {
	
		var para = $('<div>', {'id': 'confirm', 'html': o.msg, 'class': 'confirm'}),
		    br = $('<div>', {'class': 'br'}),
		    yes = $('<button>', {'class': 'button green', 'html': 'Yes'}),
		    no = $('<button>', {'class': 'button black', 'html': 'No'}),
			to_id;
		
		if (o.type === 'default') {
		    yes.click(function () {
			    $.fancybox.close();	
		        Message.flag = true;
                setTimeout(function(){o.callBack()}, 1000);		
		    });
		
		    no.click(function () {
			    $.fancybox.close();
		        Message.flag = false;		       
			    o.callBack();
		    });
		
		    br.appendTo(para);
		    no.appendTo(para);
		    yes.appendTo(para);
        }
		
        if (o.type === 'alert') {
			
		    br.appendTo(para);
			
			para.click(function () {
			    clearTimeout(to_id);
			    $.fancybox.close();
				o.callBack();
			});
			
			to_id = setTimeout(function () {
		        $.fancybox.close();
			    o.callBack();
		    }, 5000);
		}
		
        $.fancybox({
		    overlayOpacity: '0.0',
			showCloseButton: false,
			hideOnOverlayClick: false,
			content: para
        });
	},
	
    waiting: function (msg, x) {
	    this.messages.push(msg);
		if ($("#appMessage")) {
			$("#appMessage").fadeOut(function(){
				$("#appMessage").remove();
			});
		}
		
	    $('#notice-count').html(this.messages.length).css('background','red');
		
	    var elem = $('<div>', {'id': 'appMessage', 'class': 'notice', 'html': msg});
		
		elem.click (function () {
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
		
		if (x) {
		    setTimeout(function () {
			    elem.click();
		    }, x);
	    }
		else {
		    setTimeout(function () {
			    elem.click();
		    }, 2000);
		}
				
		elem.hide().appendTo('body').slideDown();
	},
	
    ajax: function (data) {
	    $(data).click(function(e) {
	        e.preventDefault();
	        $.fancybox.showActivity();

		    $.get($(this).attr('href'), function(data) {
                $.fancybox(data, {
				    overlayOpacity: '0.0',
					hideOnOverlayClick: false
				}); 		   
		    }, 'html');
	    });	
		
		return this;
	}
},

Panels = {
    activateTopPanel: function () {
	    
	    $("#open").click(function(e) {
	        e.preventDefault();
	        $("#toggle a").toggle();
		    $("#panel").stop().animate({
		        'marginTop': '0px'
		    }, 500, function(){$("#name").focus();});
	    });
		
		$("#close").click(function(e){
		    e.preventDefault();
			$("#toggle a").toggle();
			$("#panel").stop().animate({
			    'marginTop': '-225px'
			});
		});	
		
	    if($("#logoff")) {
		    $("#logoff").click(function(e) {
			    e.preventDefault();
				
				var lin = $(this).attr("href");
				
				var bool = Message.confirm({
				    type: "default",
					msg: "Are you sure you want to abort game?",
					callBack: function () {
			            var flag = Message.getFlag();
					    if (flag)
					        location.href = "index.php" + lin;
					}
	           }); 
	       }); 
	    }
	},

    activateSidePanel: function () {
	    $('.challenge').live('click', function(e){
		    e.preventDefault();
			var url = $(this).attr('href'), id, bool;
			
			id = url.substring(url.lastIndexOf('/') + 1, url.length);
			
			id = parseInt(id);
			
			bool = Message.confirm({
			    type: "alert", 
				
				msg: "Your challenge request has been sent to UserId:" + id + ", please wait for responce",
				
				callBack: function() {
			        $('#hglass').fadeIn(function() {
				        $("#wait").fadeIn();
				    });
			    }
	        });		
	    });
	}
},

Board = function() {
  return ({ 
    cells: {
        'a': ['red', null, 'red', null, 'red', null, 'red', null],
		
		'b': [null, 'red', null, 'red', null, 'red', null, 'red'],
		
		'c': ['red', null, 'red', null, 'red', null, 'red', null],
		
		'd': [null, null, null, null, null, null, null, null], 
		
		'e': [null, null, null, null, null, null, null, null],
		
		'f': [null, 'white', null, 'white', null, 'white', null, 'white'],
		
		'g': ['white', null, 'white', null, 'white', null,'white', null],
		
		'h': [null, 'white', null, 'white', null, 'white', null, 'white']
	},
	
	// board y axis
	y_axis: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
	
	// board numeric value
	alph_lookup: {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7} 	
  });
},


Hacks = {
    fixDraftHover: function() {
       $(".black_div").hover(function() {
	       $(this).css('background','yellow');
	   }, function() {
	       $(this).css('background','black');
	   });	
    },
	
    disqusComments: function() {     
        var dsq = document.createElement('script'); 
		
		dsq.type = 'text/javascript'; 
	    dsq.async = true;
		dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);	
	}
},


fileIO = {
    open: function(o) {
        $.get(o.url, o.data, function (responce) {
	        if (!responce)
		        return false;
		    else 
		        return responce;
	    },'json');
    }
},

toolTips = {
    activate: function(c) {
        $(function(){
            $("."+c).tipTip({delay: 200, defaultPosition: 'top', edgeOffset: 10});
        });	
	}
};