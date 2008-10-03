

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

  var note = '<div class="note">';
  note += '<div class="dates">';
  if (fields['start'])
    note += '<span class="start_date left">' + format_date(fields['start']) + '</span>';
  if (fields['end'])
    note += '<span class="end_date right">' + format_date(fields['end']) + '</span>';
  if (!fields['start'] && !fields['end'])
    note += '<p class="create_date center">' + format_date(fields['created']) + '</p>';

  note += '</div>';
  note += '<p class="title center">' + fields['title'] + '</p>';
  note += '<p class="tags center">' + fields['tags'] + '</p>'; 
  note += '</div>';
  var new_note = $(note);
  new_note.click(function() {
      window.location = "/n/" + fields['slug'] + "/";
    });
  $(id).append(new_note);
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

var sort_and_filter_notes = function() {
  displayed = serialized.slice();
  for (var i=0; i<current_filters.length; i++) {
    var filter = current_filters[i];
    // filter...
  };
  
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
      /*
      if (children.length == 1) {
	var filter_mod;
      }
      //else 
      */

      current_filters.push(filter.value);
      
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

var filter_options = ['has tags','title matches','type is','started','ended', 'created'];

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
