    DRAFT.makeDraggable = function () { 	// makes
	    var CURRENT, $this = this,
        params = {			 
		     scroll: false,
             drag: function(event, ui) { 
                 $(this).css({
                     'z-index': 1000  // make sure the pon is alway over other elems.
                  });
             },		

		     start: function() {
			     CURRENT = $(this); 
		         $this.me.from = CURRENT.parent().attr("id"); // read current_pon position
			     $this.current_pon = CURRENT;  // grab current_pon pon object
                 $this.current_pon.draggable({
		             revert: false     // remove any revert events
		         });
		     }
		};
		
        if (!$.browser.webkit) // exclude containment in webkit browsers
            params.containment = "#game";
		
        $('.'+$this.me.color).draggable(params);
		$this.log.push('makeDraggable Registered');
		return $this;
    };



    DRAFT.makeWhiteboxUndroppable = function() { 
	    var $this = this;
		$(".white_div").droppable({		
			    drop: function(event, ui) {
				    $this.log.push($this.color + ' dropped on white space');
                    Message.waiting('ERROR! Illigal Move');
                    $this.current_pon.addClass('revert');
                    $(".revert").draggable({
		                 revert: true
		            });					
			    }		
        });
		$this.log.push('makeWhiteboxUndroppable Registered');	
		return $this;
    };


	//Allow pons to be dropped on the back squares
    DRAFT.makeBlackboxDroppable = function() {
	    var to = null, $this = this;
	
        $(".black_div").droppable({	
		    accept: '.pon',
		
		    hoverClass: 'yellow',
			
            drop: function(event, ui) {
	            to = $(this).attr("id");  // read 'new' position
				$this.me.to = to; // store this position for use when creating an ajax request.
		        $this.movePon($this.me.from, to); // move to new positon.
				$this.current_pon = null;
	        }
        });
		
		$this.log.push('makeBlackboxDroppable Registered');	
		return $this;
    };

	
    DRAFT.onSizeChange = function() {
	    var $this = this, leftP = $("#leftPanel"), main = $("#main"), game = $("#game");
		
		$(window).load(function() {
            var w = $(document).width() - 450, h = ($(document).height() - 45);
	        main.css("width", w);
	        game.css("margin", "100px auto");
	        leftP.css("height", h);
		});
		
		$(window).resize(function() {
		    var w = $(document).width() - 450, h = $(document).height();
			main.css("width", w);
			game.css("margin", "100px auto");
			$("#leftPanel").css("height", h);
	    });
	   
	    $this.log.push('onSizeChange Registered');
        return $this;		
    };

    DRAFT.challenge = function() { 
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
    };

	
    DRAFT.onMoveComplete = function () {
	    var $this = this;
	    window.clearTimeout($this.timeout_id);
		
		$this.me.action = 'move';
		
	    (function getData(){ 
            $.get('index.php', $this.me, function(r) {
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
    };


	
    DRAFT.processMove = function (from, to, colo, remove) {
	    var next_move_num = parseInt(to), next_move_alph = to.charAt(1),
	    alph = from.charAt(1), num = from.charAt(0), $this = this, 
			
	    cell_from = $('#'+from), cell_to = $('#'+to), cell_remove;
         
        $this.board.cells[alph][num] = null;
        $this.board.cells[next_move_alph][next_move_num] = colo;
	     		 
        cell_from.empty();
		cell_from.css('background', '#000000'); //hover fix after dragging
        cell_to.html('<img src="' + $this.imagesFolder + colo + '.png" class="pon '+colo+'">');
	
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
    };
	

    DRAFT.movePon = function (current_div_id, moved_to) {
        var $this = this, next_move_num = parseInt(moved_to), next_move_alph = moved_to.charAt(1),
	        alph = current_div_id.charAt(1), num = parseInt(current_div_id),
            other_player = ($this.me.color === 'white') ? 'red' : 'white', 
            red_num = (num < next_move_num) ? num + 1 : num - 1,
            red_aplh = ($this.board.alph_lookup[alph] < $this.board.alph_lookup[next_move_alph]) ? $this.board.y_axis[($this.board.alph_lookup[alph]) + 1] : $this.board.y_axis[($this.board.alph_lookup[alph]) - 1];
			
		$this.me.from = current_div_id; 
		$this.me.to = moved_to;			
		 
        if ( (next_move_num === (num + 1) || next_move_num === (num - 1)) && 
		     ( (next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) + 1] && $this.me.color === 'red')|| 
			   (next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) - 1] && $this.me.color === 'white')) && 
			 !$this.board.cells[next_move_alph][next_move_num] 
           ){
		    if (($this.me.color === 'white' && $this.board.alph_lookup[alph] === '7') || ($this.me.color === 'red' && $this.board.alph_lookup[alph] === '0')) {
			    $this.current_pon.addClass('king').attr('src', $this.me.color + '_king.jpg');
			}
            $this.processMove(current_div_id, moved_to, $this.me.color).makeDraggable();
	        $('.'+$this.me.color).draggable('disable');
			
			//$this.onMoveComplete();
            return $this;			   
         }

         if ((next_move_num === (num + 2) || next_move_num === (num - 2)) && ((next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) - 2] || next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) + 2]) || (next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) + 2] || next_move_alph === $this.board.y_axis[($this.board.alph_lookup[alph]) - 2])) && !$this.board.cells[next_move_alph][next_move_num] && $this.me.color !== other_player && $this.board.cells[red_aplh][red_num] === other_player			 
            ){
		    if (($this.me.color === 'white' && num === '7') || ($this.me.color === 'red' && num === '0')) {
			    $this.current_pon.addClass('king').attr('src', $this.me.color + '_king.jpg');
			}
             $this.me.remove = red_num + red_aplh;
			 $this.processMove(current_div_id, moved_to, $this.me.color, (red_num + red_aplh)).makeDraggable();
	         $('.'+$this.me.color).draggable('disable');

             //$this.onMoveComplete();				  
             return $this;				   
         }
		  
         else {
		     Message.waiting('ERROR! Illigal Move');
             $this.me.from = ''; 
		     $this.me.to = '';
             $this.current_pon.addClass('revert');
             $(".revert" ).draggable({
		         revert: true
		     });	
			 return $this;
        }
    };

   
    DRAFT.onLogout = function () {
	    var $this = this;
		
	    if (!(!!$this.me.game_id)) {
		    $.get('index.php?logoff=1', {action:'onLogout', player: $this.me.color}, function(r) {
			     $this.log.push(r);
			},'json');
			
			return $this;
        }			
		return $this;
    };