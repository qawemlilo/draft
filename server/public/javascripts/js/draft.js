/*!
****************************************************
COPYRIGHT 2012 Raging Flame
AUTHOR: Qawelesizwe Mlilo
EMAIL: qawemlilo@gmail.com
****************************************************
*/

var DRAFT = {
	
	
	current_pon: '', // holds the current_pon object 
    
    socket: {},
	
	imagesFolder: 'http://apps.rflab.co.za/draft/images/', // images
	
	// holds the identifier for all time outs
	timeout_id: '',  

	
    board: {
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
        
	
	    // board lookup
        lookup: {
            'x': {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7},
            'y': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        }            
    
    }, 
    
	
	//error log
	opponent: {},
	
	// holds values for current player
	me: {
        action: '',    
		color: '',
		id: 0,
		from: '',
        oppId: 0,
		to: '',
		remove: ''
    },

	
	//  holds the score for both players
	score: { 
	    red: 0,
		white: 0
	},
	
    
	//Call to initialize the game
	init: function (div, opts, s) {
	    var view = "render_white_pons", $this = DRAFT;
        
        if (s) {
            $this.socket = s;
        }
         
	    if (!opts.color) {
		    opts.color = "white";			 
		}
		else {
			view = "render_" + opts.color + "_pons";			 
		}
		if (!div) {
		   alert("init() Missing parameter");
		   return false;
		}
		 
		$this.me.color = opts.color;
        $this.me.id = opts.id || '';
        $this.me.oppId = opts.opponent || 0;
        
		$this[view](div)
          .makeDraggable()
            .makeWhiteboxUndroppable()
              .makeBlackboxDroppable();
              
        $('.'+$this.me.color).draggable('disable');
        
		return $this;
	},
    
    
    shout: function (msg, msgType, secs) {
    
        $("#appMessage").remove();
        
        var elem = $('<div>', {'id': 'appMessage', 'class': msgType || 'notice', 'html': msg});
		
		elem.click (function () {
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});

        if (secs) {
            setTimeout(function () {
			    elem.click();
		    }, secs * 1000);
        }
				
		elem.hide().appendTo('body').slideDown();
	}
};