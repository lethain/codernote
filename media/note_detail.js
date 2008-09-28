$(document).ready(function() {
    var make_spans_editable = function() {
	var input = $('<input class="large" value="'+this.innerHTML+'">');
	input.hover(function(){},
		    function() {
		      var str = '<span id="'+this.id+'" class="editable">'+input.val()+'</span>';
		      var new_input = $(str);
		      new_input.click(make_spans_editable);
		      input.replaceWith(new_input);
		      
		    });

	$(this).replaceWith(input);
    };
    $("span.editable").click(make_spans_editable);
    
  });
