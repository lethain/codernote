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
      var text = $("#writing-storage").text();
      if (text.length == 0) {
	type = "plain";
	text = "You haven't written anything yet. Double click here to edit.";
      }
      if (type == "plain") {
	var new_p = $('<p id="writing">'+text+'</p>');
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
	$.ajax({type:"POST", url:"/note/delete/"+$("#slug").val()+"/", complete:redir});
      });

    var unpublish_flow = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $(ele).text("Publish in Flow");
	  $(ele).unbind('click').click(publish_flow);
	  $("#flowdiv").addClass("hidden");	  
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/unpublish/flow/"+$("#slug").val()+"/",complete:cmp});
      return false;
    }

    var publish_flow = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $(ele).text("Unpublish from Flow");
	  $(ele).unbind('click').click(unpublish_flow);
	  $("#flowdiv").removeClass("hidden");
	  $("#flowurl")[0].href = res.responseText;
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/publish/flow/"+$("#slug").val()+"/",complete:cmp});
      return false;
    }


    $("#publish-flow").click(publish_flow);
    $("#unpublish-flow").click(unpublish_flow);

    var close_share_box = function() {
      $("#share").unbind('click').click(open_share_box).text("Share with...");
      $("#share-target").addClass("hidden");
      $("#share-confirm").addClass("hidden");
      return false;
    }

    var open_share_box = function() {
      $("#share").text("Cancel").unbind('click').click(close_share_box);
      $("#share-target").removeClass("hidden");
      $("#share-confirm").removeClass("hidden");
      return false;
    }

    $("#share").click(open_share_box);


    var unpublish_hash = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $(ele).text("Publish Hash");
	  $(ele).unbind('click').click(publish_hash);
	  $("#hashdiv").addClass("hidden");	  
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/unpublish/hash/"+$("#slug").val()+"/",complete:cmp});
      return false;
    }

    var publish_hash = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $(ele).text("Unpublish Hash");
	  $(ele).unbind('click').click(unpublish_hash);
	  $("#hashdiv").removeClass("hidden");
	  $("#hashurl")[0].href = "/hash/"+res.responseText+"/";
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/publish/hash/"+$("#slug").val()+"/",complete:cmp});
      return false;
    }


    $("#publish-hash").click(publish_hash);
    $("#unpublish-hash").click(unpublish_hash);

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
