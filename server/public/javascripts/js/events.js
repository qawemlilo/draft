(function(draft) {    
    draft.makeDraggable = function () { 	// makes
	    var CURRENT, $this = draft,
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
		return $this;
    };



    draft.makeWhiteboxUndroppable = function() { 
	    var $this = draft;
		$(".white_div").droppable({		
			    drop: function(event, ui) {
                    $this.shout('ERROR! Illigal Move', 'error');
                    $this.current_pon.addClass('revert');
                    $(".revert").draggable({
		                revert: true
		            });					
			    }		
        });

		return $this;
    };


	//Allow pons to be dropped on the back squares
    draft.makeBlackboxDroppable = function() {
	    var to = null, $this = draft;
	
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
	
		return $this;
    };
    
	
    draft.moveComplete = function () {
        draft.me.action = 'move';
	    draft.socket.emit('move', JSON.stringify(draft.me));
		return draft;
    };


	
    draft.onMove = function (from, to, colo, remove) {
	    var next_move_num = parseInt(to), next_move_alph = to.charAt(1),
	    alph = from.charAt(1), num = from.charAt(0), $this = draft, 
			
	    cell_from = $('#'+from), cell_to = $('#'+to), cell_remove;
         
        $this.board.cells[alph][num] = null;
        $this.board.cells[next_move_alph][next_move_num] = colo;
	     		 
        cell_from.empty();
		cell_from.css('background', '#000000'); //hover fix after dragging
        cell_to.html('<img src="' + $this.imagesFolder + colo + '.png" class="pon '+colo+'">');
	
	    if (remove) {
		    cell_remove = $('#' + remove)
	        cell_remove.empty();
		    $this.board.cells[remove.charAt(1)][parseInt(remove)] = null;
			cell_remove = null;
	    }
		cell_from = null;
		cell_to = null;
		return $this;
    };
	

    draft.movePon = function (current_div_id, moved_to) {
        var $this = draft, next_move_num = parseInt(moved_to), next_move_alph = moved_to.charAt(1),
	        alph = current_div_id.charAt(1), num = parseInt(current_div_id),
            other_player = ($this.me.color === 'white') ? 'red' : 'white', 
            red_num = (num < next_move_num) ? num + 1 : num - 1,
            red_aplh = ($this.board.lookup.x[alph] < $this.board.lookup.x[next_move_alph]) ? $this.board.lookup.y[($this.board.lookup.x[alph]) + 1] : $this.board.lookup.y[($this.board.lookup.x[alph]) - 1];
			
		$this.me.from = current_div_id; 
		$this.me.to = moved_to;			
		 
        if ((next_move_num === (num + 1) || next_move_num === (num - 1)) && 
		    ((next_move_alph === $this.board.lookup.y[($this.board.lookup.x[alph]) + 1] && $this.me.color === 'red')|| 
			(next_move_alph === $this.board.lookup.y[($this.board.lookup.x[alph]) - 1] && $this.me.color === 'white')) && 
			!$this.board.cells[next_move_alph][next_move_num] 
        ) {
        
		    if (($this.me.color === 'white' && $this.board.lookup.x[alph] === '7') || ($this.me.color === 'red' && $this.board.lookup.x[alph] === '0')) {
			    $this.current_pon.addClass('king').attr('src', $this.me.color + '_king.jpg');
			}
            $this.onMove(current_div_id, moved_to, $this.me.color).makeDraggable();
	        $('.'+$this.me.color).draggable('disable');
			
			$this.moveComplete();
            return $this;			   
        }

        if ((next_move_num === (num + 2) || next_move_num === (num - 2)) && 
            ((next_move_alph === $this.board.lookup.y[($this.board.lookup.x[alph]) - 2] || next_move_alph === $this.board.lookup.y[($this.board.lookup.x[alph]) + 2]) || 
            (next_move_alph === $this.board.lookup.y[($this.board.lookup.x[alph]) + 2] || next_move_alph === $this.board.lookup.y[($this.board.lookup.x[alph]) - 2])) && 
            !$this.board.cells[next_move_alph][next_move_num] && $this.me.color !== other_player && $this.board.cells[red_aplh][red_num] === other_player
        ) {
        
		    if (($this.me.color === 'white' && num === '7') || ($this.me.color === 'red' && num === '0')) {
			    $this.current_pon.addClass('king').attr('src', $this.me.color + '_king.jpg');
			}
            
            $this.me.remove = red_num + red_aplh;
			$this.onMove(current_div_id, moved_to, $this.me.color, (red_num + red_aplh)).makeDraggable();
	        $('.'+$this.me.color).draggable('disable');

            $this.moveComplete();				  
            return $this;				   
        }
		  
        else {
		    $this.shout('ERROR! Illigal Move');
            $this.me.from = ''; 
		    $this.me.to = '';
            $this.current_pon.addClass('revert');
            $(".revert" ).draggable({
		        revert: true
		    });	
            
			return $this;
        }
    };   
}(DRAFT));