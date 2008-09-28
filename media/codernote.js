
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
  
  
