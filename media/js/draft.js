var DRAFT = {
    session:  {id: null, game_id: null},
	
	current_pon: '',  // holds the current_pon object
	
	timeout_id: '',  // holds the identifier for all time outs
	
    board: { // hold a live js copy of the board
	    cells: {'a': ['black', null, 'black', null, 'black', null, 'black', null], 
		
		        'b': [null, 'black', null, 'black', null, 'black', null, 'black'],
		
		        'c': ['black', null, 'black', null, 'black', null, 'black', null],
		
		        'd': [null, null, null, null, null, null, null, null], 
		
		        'e': [null, null, null, null, null, null, null, null],
		
		        'f': [null, 'white', null, 'white', null, 'white', null, 'white'],
		
		        'g': ['white', null, 'white', null, 'white', null,'white', null], 
		
		        'h': [null, 'white', null, 'white', null, 'white', null, 'white']
			 },
			 
		y_axis: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], // board y axis
		
		alph_lookup: {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7} // board numeric value	
	},
	
	error: [],  // error messages

	last_to_move: '',  // holds last player to have moved (used to update for viewers)
	
	last_mod_time: '', // time of last update	
	
	me: {   // holds values for current player
	    action: '',
		player: '',
		id: null,
		session: '',
		from: '',
		to: '',
		remove: '',
		time: 0
    },

	
	Score: { //  holds the score for both players
	    black: null,
		white: null
	},
	
    
	init: function(color) {
	     var p, p_o, $this = this;
		 
	     if (!color) {
		     p = "white";
			 p_o = "white_player";
		 }
		 else {
		     p = color;
			 p_o = color + "_player";		 
		 }
		 
		 $this.me.player = p;
		 $this[p_o]().make_whitebox_undroppable().make_blackbox_droppable().make_draggable(); 
		 //alert('hie');
		 //this.displayMSG('Hi, welcome to my board game');
	},	
	
	
    challenge: function() { 
        $('#play').click(function(){
		    if ($('#play').attr("value") === 'Play Me') {
				$('#black').slideDown('fast', function () {
				    $('#play').attr("value", 'Quit'); 
                })					
			}
		    else {
				$('#black').slideUp('fast', function () {
				   $('#play').attr("value", 'Play Me');
				});			    
			}
		});
       return this;		
	},
	
	
    black_player: function (div_id) { //builds the html for the board and places defualt pons
	   var i, z = 7, b_table = '<table><tbody>', t_c = 0, _class, $this = this;
	   
	   for (i = 0; i < 8; i += 1) {
	       b_table += '<tr>';
		   
		   for (c = 0; c < 8; c += 1) {
		       t_c++;
			   _class = (i  % 2 === 0) ? ((c  % 2 === 0) ?  "white_div" : "black_div") : ((c  % 2 === 0) ?  "black_div" : "white_div"); // algorithm for black n white board squares.
		       b_table += '<td><div id="' + (c + $this.board.y_axis[z - i]) + '" class="' + _class + '">' +((_class === 'black_div' && t_c < 25) ? '<img src="media/images/white.png" class="pon white">' : (_class === 'black_div' && t_c > 40) ? '<img src="media/images/black.png" class="pon black">' : '' ) + '</div></td>'; // algorithm for adding white pon at the top and black ones at hte bottom
               }   
           b_table += '</tr>';			 
	   }
	   b_table += '</tbody></table>';
	   $('#game').html(b_table);
	   return $this;
	},

	
    white_player: function() { //builds the html for the board and places defualt pons
	   var i, z = 0, b_table = '<table>', t_c = 64, _class, w, $this = this;
	   
	   for (i = 0; i < 8; i += 1) {
	       b_table += '<tr>';
		   
		   for (w = 8, c = 0; c < 8; c += 1) {
		       
			   _class = (i  % 2 === 0) ? ((c  % 2 === 0) ?  "white_div" : "black_div") : ((c  % 2 === 0) ?  "black_div" : "white_div"); // algorithm for black n white board squares.
		       b_table += '<td><div id="' + ((w -= 1) + $this.board.y_axis[z + i]) + '" class="' + _class + '">' +((_class === 'black_div' && t_c > 40) ? '<img src="media/images/black.png" class="pon black">' : (_class === 'black_div' && t_c < 25) ? '<img src="media/images/white.png" class="pon white">' : '' ) + '</div></td>'; // algorithm for adding white pon at the to and black ones at hte bottom
			   t_c--;
               }   
           b_table += '</tr>';			 
	   }
	   b_table += '</table>';
	   $('#game').html(b_table);
       return $this;
	},
	
	
    make_draggable: function () { 	// makes
	    var CURRENT, $this = this,
        params = {			 
		     scroll: false,
             /*drag: function(event, ui){ 
                 $(this).css({
                     'z-index': 200  // make sure the pon is alway over other elems.
                  });
             },	*/	

		     start: function() {
			     CURRENT = $(this); 
		         $this.me.from = CURRENT.parent().attr("id"); // read current_pon position
			     $this.current_pon = CURRENT;  // grab current_pon pon object
                 $this.current_pon.draggable({
		             revert: false     // remove any revert events
		         });
		     }
		};
		
        if (!$.browser.webkit) {
            params.containment = "#game";
        }
		
        $('.'+$this.me.player).draggable(params);
		return $this;
    },

	
    make_blackbox_droppable: function() {
	    var id = null, $this = this;
	
        $(".black_div").droppable({	
		    accept: '.pon',
		
		    hoverClass: 'yellow',
			
            drop: function(event, ui) {
	            id = $(this).attr("id");  // read 'moved to' position
				$this.me.to = id; // store this position for use when creating an ajax request.
		        $this.movePon($this.me.from, id); // move to new positon.
				$this.current_pon = null;
	        }
        });
		return $this;
    },

	
    make_whitebox_undroppable: function() { // make white board squares undroppable
	    var $this = this;
		$(".white_div").droppable({		
			    drop: function(event, ui) {
                    $this.current_pon.addClass('revert');
                    $(".revert").draggable({
		                 revert: true
		            });					
			    }		
        });
		return $this;
    },

	
	onMoveComplete: function () {
	    var $this = this;
	    window.clearTimeout($this.timeout_id);
		
		$this.me.action = 'move';
		
	    (function getData(){ 
            $.get('http://localhost/board_game/php/action.php', $this.me, function(r) {
			        if (r === false) {
					    return;
					}
					if (r.success === true) {
		                window.clearTimeout($this.timeout_id);
						$this.me.time = r.time;
			            $this.me.from = '';
			            $this.me.to = '';
			            $this.me.remove = '';
						$this.me.action = null;
			            $this.checkForUpdates();	
                     }						
		    },'json');
            $this.timeout_id = window.setTimeout(getData, 3000);		 
		})();
		
		return $this;
	},

	
	checkForUpdates: function () {
	    var $this = this, o;
		
		(function getData () {
		    $this.me.action = 'update';
		    o =  $this.me;
         
		 $.get('http://localhost/board_game/php/action.php', o, function (r) {
		     $color = ($this.me.player === 'black') ? 'white' : 'black';
		         if (!r) {
				     return;
				 }
				 
		         if (r.success === true) {
                     $this.last_to_move = r.player;
					 $this.last_mod_time = r.time;
                     $this.processMove(r.from, r.to, r.player, r.remove);			   
		         }
		        if (r.player === $color) {
		           $this.me.time = r.time;
                   $this.processMove(r.from, r.to, $color, r.remove).make_draggable();
			       $this.me.from = '';
			       $this.me.to = '';
			       $this.me.remove = '';
	               $('.'+$this.me.player).draggable('enable');
				   /*
 		           $('#'+$color).css({
		             'background': '#ffffff'
		            });
 		           $('#'+DRAFT.me.player).css({
		             'background': '#f8e6e6'
		            });
		            $('#'+$color+'_loading').css({
		              'display': 'none'
		             }); */                 				   
			       window.setTimeout("$this.displayMSG('Your turn to move!')", 1500);
			       window.clearTimeout($this.timeout_id);
		        }		   
		 },'json');
		 
         $this.timeout_id = window.setTimeout(getData, 1000);		 
	    })();
		return $this;
    },

	
    processMove: function (from, to, colo, remove) {
	    var next_move_num = parseInt(to), next_move_alph = to.charAt(1),
	        alph = from.charAt(1), num = from.charAt(0), $this = this, 
			
			cell_from = $('#'+from), cell_to = $('#'+to), cell_remove;
         
        $this.board.cells[alph][num] = null;
        $this.board.cells[next_move_alph][next_move_num] = colo;
	     		 
        cell_from.empty();
        cell_to.html('<img src="media/images/'+colo+'.png" class="pon '+colo+'">');
	
	    if (remove) {
		    cell_remove = $('#' + remove)
		    $this.Score[colo] += 10;
	        cell_remove.empty();
		    $this.board.cells[remove.charAt(1)][parseInt(remove)] = null;
			$('#'+colo+'_score').html($this.Score[colo]);
			cell_remove = null;
	    }
		cell_from = null;
		cell_to = null;
		return $this;
    },
	

    movePon: function (current_div_id, moved_to) {
        var $this = this, next_move_num = parseInt(moved_to), next_move_alph = moved_to.charAt(1),
	        alph = current_div_id.charAt(1), num = parseInt(current_div_id),
            other_player = ($this.me.player == 'white') ? 'black' : 'white', 
            red_num = (num < next_move_num) ? num + 1 : num - 1,
            red_aplh = ($this.board.alph_lookup[alph] < $this.board.alph_lookup[next_move_alph]) ? $this.board.y_axis[($this.board.alph_lookup[alph]) + 1] : $this.board.y_axis[($this.board.alph_lookup[alph]) - 1];
			
		$this.me.from = current_div_id; 
		$this.me.to = moved_to;			
		 
        if ( (next_move_num === (num + 1) || next_move_num === (num - 1)) && 
		     ( (next_move_alph == $this.board.y_axis[($this.board.alph_lookup[alph]) + 1] && $this.me.player === 'black')|| 
			   (next_move_alph == $this.board.y_axis[($this.board.alph_lookup[alph]) - 1] && $this.me.player === 'white')) && 
			 !$this.board.cells[next_move_alph][next_move_num] 
           ){
		    if (($this.me.player === 'white' && $this.board.alph_lookup[alph] === '7') || ($this.me.player === 'black' && $this.board.alph_lookup[alph] === '0')) {
			    $this.current_pon.addClass('king').attr('src', $this.me.player + '_king.jpg');
			}
            $this.processMove(current_div_id, moved_to, $this.me.player).make_draggable();
	        $('.'+$this.me.player).draggable('disable');
			
			//$this.onMoveComplete();
            return $this;			   
         }

         if ((next_move_num === (num + 2) || next_move_num === (num - 2)) && ((next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) - 2] || next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) + 2]) || (next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) + 2] || next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) - 2])) && !$this.board.cells[next_move_alph][next_move_num] && $this.me.player !== other_player && $this.board.cells[red_aplh][red_num] === other_player			 
            ){
		    if (($this.me.player === 'white' && num === '7') || ($this.me.player === 'black' && num === '0')) {
			    $this.current_pon.addClass('king').attr('src', $this.me.player + '_king.jpg');
			}
             $this.me.remove = red_num + red_aplh;
			 $this.processMove(current_div_id, moved_to, $this.me.player, (red_num + red_aplh)).make_draggable();
	         $('.'+$this.me.player).draggable('disable');

             //$this.onMoveComplete();				  
             return $this;				   
         }
		  
         else {
		     $this.displayMSG('ERROR! Illigal Move');
             $this.me.from = ''; 
		     $this.me.to = '';
             $this.current_pon.addClass('revert');
             $(".revert" ).draggable({
		         revert: true
		     });	
			 return $this;
        }
    },

   
	onLogout: function () {
	    var $this = this;
		
	    if (!$this.session.game_id) {
		    $.get('index.php?logoff=1', {action:'onLogout', player: $this.me.player}, function(r) {
			     $this.error.push(r);
			},'json');
			
			return $this;
        }			
	    window.onbeforeunload = function() {
            a = confirm('Are you sure you want to quit game?');
            if(a){		
		    var o = {action:'onLogout', player: $this.me.player};
		    $.get('index.php?logoff=1', o, function(r) {
			     $this.error.push(r);
			},'json');
            } else {
                  return false;	
            }				  
		};
		return $this;
	},

	
    displayMSG: function (msg, x) {
		var elem = $('<div>', {
			id		: 'chatErrorMessage',
			html	: msg
		});
		
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
    }	
}; 