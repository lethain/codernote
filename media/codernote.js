

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


var select_options = ['tag','title','type','start-date','end-date','created-date'];

var current_sorts = [];
var sort_changed = function() {
  var sorts = $(".sort");
  current_sorts = [];
  for (var i=0; i < sorts.length; i++) {
    var sort = sorts[i];
    if (sort.value == "") $(sort).parent().remove();
    if (sort.value != "") current_sorts.push(sort.value);
  }
  create_sort_select();
};

var current_filters = [];
var filter_changed = function() {
  var filters = $(".filter");
  current_filters = [];
  for (var i=0; i < filters.length; i++) {
    var filter = filters[i];
    if (filter.value == "") $(filter).parent().remove();
    if (filter.value != "") current_filters.push(filter.value);
  }
  create_filter_select();
};
  
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

var create_filter_select = function(id) {
  if (!id) id = "#filters";
  var str = '<li><select class="filter" name="filter">';
  str += '<option value="">select filter...</option>';
  for (var i=0; i<select_options.length; i++) {
    var opt = select_options[i];
    str += '<option value="'+opt+'">'+opt+'</option>';
  }
  str += '</select></li>';
  var new_select = $(str);
  new_select.change(filter_changed);
  
  $(id).append(new_select);
}
