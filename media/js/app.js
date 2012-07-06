/*!
****************************************************
COPYRIGHT © 2011 Raging Flame
AUTHOR: Qawelesizwe Mlilo
EMAIL: qawemlilo@gmail.com
****************************************************
*/

var DRAFT = {
	
	// holds the current_pon object
	current_pon: '',  
	
	imagesFolder: 'media/images/', 
	
	// holds the identifier for all time outs
	timeout_id: '',  

	// hold a live js copy of the board
    board: {},
    
	//error log
	log: [],
	
	//error log
	opponent: {},
	
	// holds values for current player
	me: {   
	    action: '',
		color: '',
		id: 0,
		session: '',
		game_id: '',
		from: '',
		to: '',
		remove: '',
		time: 0
    },

	
	//  holds the score for both players
	score: { 
	    red: 0,
		white: 0
	},
	
    
	//Call to initialize the game
	init: function(pon_color, div) {
	     var p_o = "render_white_pons", $this = this;
		 $this.board = Board();
		 
		 //test
		 $this.log.push('Board object created: ' + ($this.board.hasOwnProperty('cells') && $this.board.hasOwnProperty('y_axis') &&  $this.board.hasOwnProperty('alph_lookup')));
         
	     if (!pon_color) {
		     pon_color = "white";			 
			 $this.log.push('Guest Visitor');
		 }
		 
		 else {
			 p_o = "render_" + pon_color + "_pons";
             $this.log.push(pon_color + ' Player');			 
		 }
		 
		 if (!div) {
		   alert("init() Missing parameter");
		   return false;
		 }
		 
		 $this.me.color = pon_color;
		 
		 $this[p_o](div)
		  .makeDraggable()
		   .makeWhiteboxUndroppable()
		     .makeBlackboxDroppable();
		      //.onSizeChange();
		 
		 return $this;
	}
}
	
DRAFT.checkForUpdates = function () {
	    var $this = this, o;
		
		(function getData () {
		    $this.me.action = 'update';
		    o =  $this.me;
         
		 $.get('index.php', o, function (r) {
		     $color = ($this.me.color === 'red') ? 'white' : 'red';
		         if (!r) {
				     return;
				 }
				 
		         if (r.success === true) {
                     $this.processMove(r.from, r.to, r.color, r.remove);			   
		         }
		        if (r.color === $color) {
		           $this.me.time = r.time;
                   $this.processMove(r.from, r.to, $color, r.remove).makeDraggable();
			       $this.me.from = '';
			       $this.me.to = '';
			       $this.me.remove = '';
	               $('.'+$this.me.color).draggable('enable');                 				   
			       window.setTimeout("Message.notice('Your turn to move!')", 1500);
			       window.clearTimeout($this.timeout_id);
		        }		   
		 },'json');
		 
         $this.timeout_id = window.setTimeout(getData, 1000);		 
	    })();
		return $this;
};	
	
	
	//builds the html for the board and places red pons for user
DRAFT.render_red_pons = function (div) { 
	   var i, z = 7, c, b_table = '<table><tbody>', k, t_c = 0, _class, $this = this;

	   
	   b_table += '<tr>';
	   for (k = 0; k < 8; k += 1) {
	       
	       b_table += '<td class="nums"><div>' + k + '</div></td>';
	   }
	   b_table += '<td class="nums"><div>  </div></tr>';

	   
	   for (i = 0, k = 7; i < 8; i += 1) {
		   b_table += '<tr>';
		   
		   for (c = 0; c < 8; c += 1) {
		       t_c++;
			   _class = (i  % 2 === 0) ? ((c  % 2 === 0) ?  "white_div" : "black_div") : ((c  % 2 === 0) ?  "black_div" : "white_div"); 
		       b_table += '<td><div id="' + (c + $this.board.y_axis[z - i]) + '" class="' + _class + '">' +((_class === 'black_div' && t_c < 25) ? '<img src="'+$this.imagesFolder+'white.png" class="pon white">' : (_class === 'black_div' && t_c > 40) ? '<img src="' + $this.imagesFolder+'red.png" class="pon red">' : '' ) + '</div></td>'; 
               }   
           b_table += '<td><div class="alphs">' + ($this.board.y_axis[k--]) + '</div></tr>';		 
	   }
	   b_table += '</tbody></table>';
	  $('#'+div).hide().append(b_table).fadeIn('slow');
	   return $this;
	};

	
	//builds the html for the board and places white pons for user
DRAFT.render_white_pons = function(div) { 
	   var i, z = 0, k = 7, c, b_table = '<table><tbody>', t_c = 64, _class, w, $this = this;
	   
	   b_table += '<tr>';
	   for (i = 0; i < 8; i += 1) {
	       
	       b_table += '<td class="nums"><div>' + (k - i) + '</div></td>';
	   }
	   b_table += '<td class="nums"><div>  </div></tr>';
	   
	   for (i = 0; i < 8; i += 1) {
	       b_table += '<tr>';
		   
		   for (w = 8, c = 0; c < 8; c += 1) {  
			   _class = (i  % 2 === 0) ? ((c  % 2 === 0) ?  "white_div" : "black_div") : ((c  % 2 === 0) ?  "black_div" : "white_div");
		
		       b_table += '<td><div id="' + ((w -= 1) + $this.board.y_axis[z + i]) + '" class="' + _class + '">' +((_class === 'black_div' && t_c > 40) ? '<img src="'+$this.imagesFolder+'red.png" class="pon red">' : (_class === 'black_div' && t_c < 25) ? '<img src="'+$this.imagesFolder+'white.png" class="pon white">' : '' ) + '</div></td>'; // algorithm for adding white pon at the to and red ones at hte bottom
			   t_c--;
               }   
           b_table += '<td><div class="alphs">' + ($this.board.y_axis[i]) + '</div></tr>';			 
	   }
	   b_table += '</tbody></table>';
	   $('#'+div).hide().append(b_table).fadeIn('slow');
       return $this;
};