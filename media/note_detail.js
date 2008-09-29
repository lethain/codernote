$(document).ready(function() {
    var done = function(res, status) {
      if (status == "success") display_success(res.responseText, "#top-toolbar");
      else display_error(res.responseText, "#top-toolbar");
    }

    var update = function(field, val) {
      var data = {};
      data[field] = val;
      data['slug'] = $("#slug").val();
      var args = { type:"POST", url:"/note/update/", data:data, complete:done };
      $.ajax(args);
    };


    var make_spans_editable = function() {
      var input = $('<input id="'+this.id+'" class="large" value="'+this.innerHTML+'">');
      input.hover(function(){},
		  function() {
		    update(this.id, input.val());
		    var str = '<span id="'+this.id+'" class="editable">';
		    str += input.val()+'</span>';
		      var new_input = $(str);
		      new_input.click(make_spans_editable);
		      input.replaceWith(new_input);
		  });
      $(this).replaceWith(input);
    };
    $("span.editable").dblclick(make_spans_editable);

    $("#delete").click(function() {
	var redir = function(res, status) {
	  if (status == "success") document.window = "/";
	  else display_error(res.responseText, "#top-toolbar");
	}
	$.ajax({type:"POST", url:"/note/delete/"+$("#slug")+"/", complete:redir});
      });

    var start = '01/01/1996';
    $("span.date").datePicker({createButton:false, startDate:start})
      .bind(
	    'dblclick',
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
