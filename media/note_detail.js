$(document).ready(function() {
    var done = function(res, status) {
      if (status == "success") {
	display_success(res.responseText, "#top-toolbar");
	render_text();
      }
      else display_error(res.responseText, "#top-toolbar");
    }

    var render_text = function() {
      var type = $("#type option:selected").val();
      if (type == "plain") {
	var new_p = $('<p id="writing">'+$("#writing-storage").text()+'</p>');
	$(new_p).dblclick(make_writing_editable);
	$("#writing").replaceWith(new_p);
      }
      else {
	var complete = function(res, status) {
	  var new_div = $('<div id="writing">'+res.responseText+'</div>');
	  $(new_div).dblclick(make_writing_editable);
	  if (status=="success") $("#writing").replaceWith(new_div);
	}
	var data = {'slug':$("#slug").val() };
	var args = { type:"POST", url:"/note/render/", data:data, complete:complete };
	$.ajax(args);
      }
    }

    var updates = function(data) {
      data['slug'] = $("#slug").val();
      var args = { type:"POST", url:"/note/update/", data:data, complete:done };
      $.ajax(args);
    }

    var update = function(field, val) {
      var data = {};
      data[field] = val;
      updates(data);
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

    var make_writing_editable = function() {
      var ws = $("#writing-storage");
      var ta = $('<textarea id="writing">'+ ws.text() + '</textarea>');
      ta.hover(function() {},
	       function() {
		 update('text', ta.val());
		 $("#writing-storage").text(ta.val());
		 var new_div = $('<div id="writing"></div>');
		 $(new_div).dblclick(make_writing_editable);
		 render_text();
	       });
      $(this).replaceWith(ta);
    };
    $("#writing").dblclick(make_writing_editable);

    $("#type").change(function() {
	var val = $("#type option:selected").val();
	if (val == 'snippet') {
	  $("#detail_div").removeClass('hidden');
	}
	else {
	  $("#detail_div").addClass('hidden');
	  $("#type option:selected").val();
	  update('type',val);
	  render_text();
	}
      });

    $("#type_detail").change(function() {
	updates({'type_detail':$("#type_detail option:selected").val(),
	      'type':$("#type option:selected").val() });
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
	      var str = (d.getMonth()+1) + "/" +d.getDate() +"/"+d.getFullYear();
	      update(this.id, str);
	      var year = ("" + d.getFullYear()).substring(2);
	      str = (d.getMonth()+1) + "/" +d.getDate() +"/"+year;
	      $(this).text(str);
	    });
  });
