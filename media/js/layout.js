(function(draftLayout) {  
    draftLayout.render_red_pons = function (div) { 
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
		       b_table += '<td><div id="' + (c + $this.board.lookup.y[z - i]) + '" class="' + _class + '">' +((_class === 'black_div' && t_c < 25) ? '<img src="'+$this.imagesFolder+'white.png" class="pon white">' : (_class === 'black_div' && t_c > 40) ? '<img src="' + $this.imagesFolder+'red.png" class="pon red">' : '' ) + '</div></td>'; 
               }   
           b_table += '<td><div class="alphs">' + ($this.board.lookup.y[k--]) + '</div></tr>';		 
	   }
	   b_table += '</tbody></table>';
	  $('#'+div).empty().hide().append(b_table).fadeIn('slow');
	   return $this;
	},

	
	//builds the html for the board and places white pons for user
    draftLayout.render_white_pons = function(div) { 
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
		
		       b_table += '<td><div id="' + ((w -= 1) + $this.board.lookup.y[z + i]) + '" class="' + _class + '">' +((_class === 'black_div' && t_c > 40) ? '<img src="'+$this.imagesFolder+'red.png" class="pon red">' : (_class === 'black_div' && t_c < 25) ? '<img src="'+$this.imagesFolder+'white.png" class="pon white">' : '' ) + '</div></td>'; // algorithm for adding white pon at the to and red ones at hte bottom
			   t_c--;
               }   
           b_table += '<td><div class="alphs">' + ($this.board.lookup.y[i]) + '</div></tr>';			 
	   }
	   b_table += '</tbody></table>';
	   $('#'+div).empty().hide().append(b_table).fadeIn('slow');
       return $this;
    };
}(DRAFT));