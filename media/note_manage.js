$(document).ready(function() {
    var update = function() {
	var ele = this;
	var cmp = function(res, status) {
	  if (status == "success") $("#"+res.responseText).fadeOut('slow');
	  else display_error(res.responseText, "#errors");
	}
	$.ajax({type:"POST",url:this,data:{},complete:cmp});
	return false;
      }
    $(".yes").click(update);
    $(".no").click(update);
  });
