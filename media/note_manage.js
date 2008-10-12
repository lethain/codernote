$(document).ready(function() {
    $(".yes").click(function() {
	var ele = this;
	var cmp = function(res, status) {
	  if (status == "success") $("#"+ele.id).fadeOut('slow');
	  else display_error(res.responseText, "#errors");
	}
	$.ajax({type:"POST",url:"accept/"+ele.pk+"/",complete:cmp});
	return false;
      });

    $(".no").click(function() {
	var ele = this;
	var cmp = function(res, status) {
	  if (status == "success") $("#"+ele.id).fadeOut('slow');
	  else display_error(res.responseText, "#errors");
	}
	$.ajax({type:"POST",url:"reject/"+ele.pk+"/",complete:cmp});
	return false;
      });


  });
