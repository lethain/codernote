$(document).ready(function() {
    var make_spans_editable = function() {
	var input = $('<input class="large" value="'+this.innerHTML+'">');
	input.hover(function(){},
		    function() {
		      var str = '<span id="'+this.id+'" class="editable">';
		      str += input.val()+'</span>';
		      var new_input = $(str);
		      new_input.click(make_spans_editable);
		      input.replaceWith(new_input);
		    });
	$(this).replaceWith(input);
    };
    $("span.editable").click(make_spans_editable);

    var start = '01/01/1996';

    $("span.date").datePicker({createButton:false, startDate:start})
      .bind(
	    'click',
	    function() {
	      $(this).dpDisplay();
	      this.blur();
	      return false;
	    })
      .bind(
	    'dateSelected',
	    function(e, d, $td) {
	      var str = (d.getMonth()+1) + "/" +d.getDate() +"/"+d.getYear();
	      $(this).text(str);
	    });
    
  });
