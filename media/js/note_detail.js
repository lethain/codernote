$(document).ready(function() {
    var save_timer;
    var currently_editing = false;
    var done = function(res, status) {
      if (status == "success") {
	display_success(res.responseText, "#top-toolbar");
	if (!currently_editing) render_text();
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
      var complete = function(res, status) {
	var new_div = $('<div id="writing">'+res.responseText+'</div>');
	$(new_div).dblclick(make_writing_editable);
	if (status=="success") $("#writing").replaceWith(new_div);
      }
      var data = {'slug':$("#slug").val() };
      var args = { type:"POST", url:"/note/render/", data:data, complete:complete };
      $.ajax(args);
    }

    /*
	  $($(ele).children()[0]).text("Publish in Flow");
	  $(ele).unbind('click').click(publish_flow);
    */
    var show_revision_text = function() {
      $($(this).children()[0]).text("Hide Text");
      var txt = $(this).parent().parent().children("pre").removeClass('hidden');
      $(this).unbind('click').click(function() {
	  $(txt).addClass('hidden');
	  $($(this).children()[0]).text("Show Text");
	  $(this).unbind('click').click(show_revision_text);
	  return false;
	});
      
      return false;
    }

    var delete_revision = function() {
      var rev = $(this).parent().parent();
      var data = {slug:$("#slug").val(), id:rev[0].id};
      $.ajax({type:"POST",url:"/note/revision/delete/",data:data});
      rev.fadeOut('slow',function(){ $(this).remove();});
      return false;
    }

    var hide_revisions = function() {
      $("#writing").removeClass('hidden');
      $("#revisions").addClass('hidden');
      $("#show-revisions").unbind('click').click(fetch_revisions);
      $($("#show-revisions").children()[0]).text("Show Revisions");
    };

    var revert_to_revision = function() {
      var complete = function(res, status) {
	if (status=="success") render_text();
      }
      var rev = $(this).parent().parent();
      var data = {slug:$("#slug").val(), id:rev[0].id};
      $.ajax({type:"POST",url:"/note/revision/revert/",data:data,complete:complete});
      hide_revisions();
      return false;
    }

    var fetch_revisions = function() {
      var complete = function(res, status) {
	if (status=="success") {
	  finish_editing();
	  $("#revisions").html(res.responseText).removeClass('hidden');
	  $("#revisions .show-rev-text").click(show_revision_text);
	  $("#revisions .delete-revision").click(delete_revision);
	  $("#revisions .revert-to-revision").click(revert_to_revision);
	  $("#writing").addClass('hidden');
	  $($("#show-revisions").children()[0]).text("Hide Revisions");
	  $("#show-revisions").unbind('click').click(hide_revisions);
	  
	}
	else display_error(res.responseText,'#details');
      }
      var data = {slug:$("#slug").val() };
      $.ajax({type:"POST",url:"/note/revisions/",data:data,complete:complete});
      return false;
    }
    $("#show-revisions").click(fetch_revisions);



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
      input.dblclick(function() {
		    update(this.id, input.val());
		    var str = '<span id="'+this.id+'" class="editable">';
		    str += input.val()+'</span>';
		      var new_input = $(str);
		      new_input.click(make_spans_editable);
		      input.replaceWith(new_input);
		  });
      $(this).replaceWith(input);
    };
    $("span.editable").click(make_spans_editable);

    $("#delete").click(function() {
	var redir = function(res, status) {
	  if (status == "success") document.window = "/";
	  else display_error(res.responseText, "#top-toolbar");
	}
	$.ajax({type:"POST", url:"/note/delete/"+$("#slug").val()+"/", data:{}, complete:redir});
      });

    var unpublish_flow = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $($(ele).children()[0]).text("Publish in Flow");
	  $(ele).unbind('click').click(publish_flow);
	  $("#flowdiv").addClass("hidden");	  
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/unpublish/flow/"+$("#slug").val()+"/", data:{}, complete:cmp});
      return false;
    }

    var publish_flow = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $($(ele).children()[0]).text("Unpublish from Flow");
	  $(ele).unbind('click').click(unpublish_flow);
	  $("#flowdiv").removeClass("hidden");
	  $("#flowurl")[0].href = res.responseText;
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/publish/flow/"+$("#slug").val()+"/", data:{}, complete:cmp});
      return false;
    }


    $("#publish-flow").click(publish_flow);
    $("#unpublish-flow").click(unpublish_flow);

    var close_share_box = function() {
      $($("#share").children()[0]).text("Share with...");
      $("#share").unbind('click').click(open_share_box);
      $("#share-details").addClass("hidden");
      //$("#share-confirm").addClass("hidden");
      return false;
    }

    var open_share_box = function() {
      $("#share").unbind('click').click(close_share_box);
      $($("#share").children()[0]).text("Cancel sharing...");
      $("#share-details").removeClass("hidden");
      //$("#share-confirm").removeClass("hidden");
      return false;
    }

    $("#share").click(open_share_box);

    var unpublish_hash = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $($(ele).children()[0]).text("Publish Hash");
	  $(ele).unbind('click').click(publish_hash);
	  $("#hashdiv").addClass("hidden");	  
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/unpublish/hash/"+$("#slug").val()+"/",data:{},complete:cmp});
      return false;
    }

    var publish_hash = function() {
      var ele = this;
      var cmp = function(res, status) {
	if (status == "success") {
	  $($(ele).children()[0]).text("Unpublish Hash");
	  $(ele).unbind('click').click(unpublish_hash);
	  $("#hashdiv").removeClass("hidden");
	  $("#hashurl")[0].href = "/hash/"+res.responseText+"/";
	}
	else display_error(res.responseText, "#top-toolbar");
      }
      $.ajax({type:"POST",url:"/publish/hash/"+$("#slug").val()+"/",data:{}, complete:cmp});
      return false;
    }

    $("#share-target").keyup(function() {
	var ele = this;
	var cmp = function(res, status) {
	  if (status == "success") $(ele).css('background-color','#A0A0FF');
	  else $(ele).css('background-color','#FFA0A0');
	}
	$.ajax({type:'GET',url:'/user/exists/'+$(this).val(),data:{},complete:cmp});
      });

    $("#share-confirm").click(function() {
	var cmp = function(res, status) {
	  if (status == "success") close_share_box();
	  else display_error(res.responseText, "#top-toolbar");
	}
	var url = "/share/"+$("#slug").val()+"/"+ $("#share-target").val()  +"/";
	$.ajax({type:"POST",url:url,data:{},complete:cmp});
	return false;
      });

    $("#publish-hash").click(publish_hash);
    $("#unpublish-hash").click(unpublish_hash);
    

    var ws;
    var ta;

    var finish_editing = function() {
      clearInterval(save_writing);
      update('text', ta.val());
      $("#writing-storage").text(ta.val());
      var new_div = $('<div id="writing"></div>');
      $(new_div).dblclick(make_writing_editable);
      render_text();
      $($("#finish-editing").children()[0]).text("Edit Note");
      $("#finish-editing").unbind('click').click(make_writing_editable);
      currently_editing = false;
      return false;
    }

    var save_writing = function() {
      if (ta && currently_editing) {
	update('text', ta.val());
	display_error('Autosaving...','#details')
      }
    }

    var make_writing_editable = function() {
      save_timer = setInterval(save_writing, 1000*60*5);
      ws = $("#writing-storage");
      ta = $('<textarea id="writing">'+ ws.text() + '</textarea>');
      $($("#writing")).replaceWith(ta);
      $($("#finish-editing").children()[0]).text("Finish editing");
      $("#finish-editing").unbind('click').click(finish_editing);
      hide_revisions();
      currently_editing = true;
      return false;
    };
    $("#writing").dblclick(make_writing_editable);
    $("#finish-editing").click(make_writing_editable);

    $("#type").change(function() {
	var val = $("#type option:selected").val();
	if (val == 'snippet') {
	  $("#detail_div").removeClass('hidden');
	}
	else {
	  $("#detail_div").addClass('hidden');
	  $("#type option:selected").val();
	  update('type',val);
	  if (!currently_editing) render_text();
	}
      });

    $("#type_detail").change(function() {
	updates({'type_detail':$("#type_detail option:selected").val(),
	      'type':$("#type option:selected").val() });
      });

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
	      var str = (d.getMonth()+1) + "/" +d.getDate() +"/"+d.getFullYear();
	      update(this.id, str);
	      var year = ("" + d.getFullYear()).substring(2);
	      str = (d.getMonth()+1) + "/" +d.getDate() +"/"+year;
	      $(this).text(str);
	    });
  });
