
var truncate_string = function(s, length) {
  if (s.length > length) {
    return s.substr(0,length-3)+"...";
  }
  return s;
}

var display_success = function(msg, elem) {
  /*
  var msg_div = $('<div class="report success"><p>'+msg+'</p></div>');
  msg_div.insertAfter(elem).fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow',function() { msg_div.remove(); });
  */
}; 

var display_error = function(msg, elem) {
  var msg_div = $('<div class="report error"><p>'+msg+'</p></div>');
  msg_div.insertAfter(elem).fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow',function() { msg_div.remove(); });
};

var format_date = function(obj) {
  var date = obj.split(" ")[0]
  var parts = date.split("-");
  return parts[1]+"/"+parts[2]+"/"+parts[0];
}

var create_note = function(obj, id) {
  if (!id) id = "list";
  var fields = obj['fields'];

  var note = '<div class="note '+fields['type']+ '">';
  note += '<div class="dates">';
  if (fields['start'])
    note += '<span class="start_date left">' + format_date(fields['start']) + '</span>';
  if (fields['end'])
    note += '<span class="end_date right">' + format_date(fields['end']) + '</span>';
  if (!fields['start'] && !fields['end'])
    note += '<p class="create_date center">' + format_date(fields['created']) + '</p>';

  note += '</div>';
  note += '<p class="title center">' + truncate_string(fields['title'],20) + '</p>';
  note += '<p class="tags center">' + fields['tags'] + '</p>'; 
  note += '</div>';
  var new_note = $(note);
  new_note.click(function() {
      window.location = "/n/" + fields['slug'] + "/";
    });
  $(id).append(new_note.hide().fadeIn(200));
}

var create_notes = function(lst, id) {
  if (!id) id = "list";
  for (var i=0; i<lst.length; i++) {
    create_note(lst[i], id)
  }
};

/*
{"pk": 1,
 "model": "codernote.note", 
"fields": {"end": null, 
"tags": "django, python, project", 
"text": "", 
"created": "2008-09-28 13:47:42", 
"start": "2008-09-28 00:00:00", 
"type_detail": "JavaScript", 
"title": "CoderNote", 
"type": "markdown", 
"slug": "coder_note"}}
*/

var alpha_compare = function(a,b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

var date_convert = function(d) {
  if (!d) return [0,0,0,0,0,0];
  return [parseInt(d.slice(0,4)), parseInt(d.slice(5,7)),parseInt(d.slice(8,10)),parseInt(d.slice(11,13)),parseInt(d.slice(14,16)),parseInt(d.slice(17,19))];
};
  
var date_compare = function(a,b) {
  a = date_convert(a);
  b = date_convert(b);
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

var filter_array = function(array, func) {
  var new_array = [];
  for (var i=0; i<array.length; i++) {
    var c = array[i];
    if (func(c)) new_array.push(c);
  }
  return new_array;
}

/*
var date_filters = ['today','this week','this month','this year','tomorrow','next week','next month','next year','yesterday','last week','last month','last year'];

var convert_dateword(dw) {
  if (dw == 'today') return [0,0];
  if (dw == 'this week') return [0,7];
  if (dw == 'this month') return [0,30];
  if (dw == 'this year') return [0,365];
  if (dw == 'tomorrow') return [1,1];
  if (dw == 'next week') return [7,14];
  if (dw == 'next month') return [30,60];
  if (dw == 'next year') return [365,730];  
  if (dw == 'yesterday') return [-1,-1];
  if (dw == 'this week') return [-7,-1];
  if (dw == 'this month') return [-30,-1];
  if (dw == 'this year') return [-365,-1];
}

var date_within = function(d, period) {
  var range = convert_dateword(period);
  var date = date_convert(d);
  //  if (!d) return [0,0,0,0,0,0];
}
*/

var sort_and_filter_notes = function() {
  displayed = serialized.slice();
  for (var i=0; i<current_filters.length; i++) {
    var filter_tuple = current_filters[i];
    var filter = filter_tuple[0];
    var modifier = filter_tuple[1];
    if (modifier == undefined) continue;
    else if (filter == 'has tag') {
      displayed = filter_array(displayed,function(x) {
	    return new RegExp(modifier,'i').test(x.fields.tags);
	  });
    }
    else if (filter == 'title contains') {
      displayed = filter_array(displayed, function(x) {
	    return new RegExp(modifier,'i').test(x.fields.title);
	  });
    }
    else if (filter == "type is") {
      displayed = filter_array(displayed, function(x) {
	  return x.fields.type == modifier.toLowerCase();
	})
    }
    /*
    else if (filter == "start date") {

    }
    else if (filter == "end date") {

    }
    else if (filter == "creation date") {

    }
    */
	
    
  }
  
  /* Perform Sorts */
  for (var i=0; i<current_sorts.length; i++) {
    var sort_tuple = current_sorts[i];
    var sort = sort_tuple[0];
    var sort_direction = sort_tuple[1];
    if (sort == 'tag')
      displayed.sort(function(a,b) {
	  var a_tags = a.fields.tags.replace(/(,[ ]*)|(,)| /g,',').split(',').sort().join('');
	  var b_tags = b.fields.tags.replace(/(,[ ]*)|(,)| /g,',').split(',').sort().join('');
	  return alpha_compare(a_tags,b_tags); 
	});
    else if (sort == 'title') {
      displayed.sort(function(a,b) {
	  return alpha_compare(a.fields.title,b.fields.title); 
	});
    }
    else if (sort == 'type')
      displayed.sort(function(a,b) {
	  return alpha_compare(a.fields.type,b.fields.type);
	});
    else if (sort == 'start-date')
      displayed.sort(function(a,b) {
	  return date_compare(a.fields.start, b.fields.start);
	});
    else if (sort == 'end-date')
      displayed.sort(function(a,b) {
	  return date_compare(a.fields.end, b.fields.end);
	});
    else if (sort == 'created-date')
      displayed.sort(function(a,b) {
	  return date_compare(a.fields.created, b.fields.created);
	});
    
    if (sort_direction == "up") displayed.reverse();
  }

  displayed.sort(function(b,a) {
      if (a.fields.sticky && b.fields.sticky) return 0;
      else if (a.fields.sticky) return 1;
      else if (b.fields.sticky) return -1;
      else return 0;
    });

  $("#list").empty();
  create_notes(displayed, "#list");
}


var select_options = ['tag','title','type','start-date','end-date','created-date'];


var current_sorts = [];
var sort_changed = function() {
  var sorts = $(".sort");
  current_sorts = [];
  for (var i=0; i < sorts.length; i++) {
    var sort = sorts[i];
    if (sort.value == "") $(sort).parent().remove();
    else if (sort.value != "") {
      // if the sort doesn't have a mod, add it
      var children = $(sort).parent().children();
      var sort_direction;
      if (children.length == 1) {
	var sort_mod = create_sort_mod();
	$(sort_mod).insertAfter($(sort));
	sort_direction = "down";
      }
      else {
	sort_direction = children[1].value;
      }
      current_sorts.push([sort.value, sort_direction]);
    }
  }
  create_sort_select();
  sort_and_filter_notes();
};

var note_types = ['Plain Text','Markdown', 'Textile', 'Snippet'];

var filter_input = function() {
  var input = $("<input>");
  input.keyup(filter_changed);
  return input;
};

var filter_type_is = function() {
  var select = "<select>";
  for (var j=0; j<note_types.length; j++) {
    var type = note_types[j];
    select += '<option value="'+type+'">'+type+'</option>';
  }
  select += '</select>';
  var s = $(select);
  s.change(filter_changed);
  return s;
};

/*
var date_filters = ['today','this week','this month','this year','tomorrow','next week','next month','next year','yesterday','last week','last month','last year'];


var filter_date = function() {
  var select = "<select>";
  for (var j=0; j<date_filters.length; j++) {
    var type = date_filters[j];
    select += '<option value="'+type+'">'+type+'</option>';
  }
  select += '</select>';
  var s = $(select);
  s.change(filter_changed);
  return s;
}
*/

var current_filters = [];
var filter_changed = function() {
  var filters = $(".filter");
  current_filters = [];
  for (var i=0; i < filters.length; i++) {
    var filter = filters[i];
    if (filter.value == "") $(filter).parent().remove();
    else {
      // add appropriate mod for filter type, if applicable
      var children = $(filter).parent().children();
      var modifier;
      if (children.length == 1) {
	if (filter.value == 'has tag') {
	  filter_input().insertAfter($(filter));
	  modifier = undefined;
	}
	else if (filter.value == 'title contains') {
	  filter_input().insertAfter($(filter));
	  modifier = undefined;
	}
	else if (filter.value == 'type is') {
	  filter_type_is().insertAfter($(filter));
	  modifier = note_types[0];
	}
	/*
	else if (filter.value == 'start date') {
	  filter_date().insertAfter($(filter));
	  modifier = date_filters[0];	 
	}
	else if (filter.value == 'end date') {
	  filter_date().insertAfter($(filter));
	  modifier = date_filters[0];
	}
	else if (filter.value == 'creation date') {
	  filter_date().insertAfter($(filter));
	  modifier = date_filters[0];
	}
	*/
      }
      else {
	modifier = children[1].value;
      }

      current_filters.push([filter.value, modifier]);
      
    }
  }
  create_filter_select();
  sort_and_filter_notes();
};

var create_sort_mod = function(id) {
  var str = '<select class="sort-mod" name="sort-mod"><option value="down">descending</option><option value="up">ascending</option></select>';
  var mod = $(str);
  mod.change(sort_changed);
  return mod;
}
  
var create_sort_select = function(id) {
  if (!id) id = "#sorts";
  var str = '<li><select class="sort" name="sort">';
  str += '<option value="">select sort...</option>';
  for (var i=0; i<select_options.length; i++) {
    var opt = select_options[i];
    str += '<option value="'+opt+'">'+opt+'</option>';
  }
  str += '</select></li>';
  var new_select = $(str);
  new_select.change(sort_changed);
  $(id).append(new_select);
};

var filter_options = ['has tag','title contains','type is'] //,'start date','end date', 'creation date'];

var create_filter_select = function(id) {
  if (!id) id = "#filters";
  var str = '<li><select class="filter" name="filter">';
  str += '<option value="">select filter...</option>';
  for (var i=0; i<filter_options.length; i++) {
    var opt = filter_options[i];
    str += '<option value="'+opt+'">'+opt+'</option>';
  }
  str += '</select></li>';
  var new_select = $(str);
  new_select.change(filter_changed);
  
  $(id).append(new_select);
}
