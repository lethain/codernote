from models import Note
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.shortcuts import render_to_response
from forms import NoteForm


""" Note """

def note_list(request):
    'Non-Ajax view.'
    return render_to_response('codernote/note_list.html')

def note_detail(request):
    'Non-Ajax view.'
    pass


def note_create(request):
    'Non-Ajax view.'
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            new_note = form.save()
            return HttpResponseRedirect(new_note.get_absolute_url())
    else:
        form = NoteForm()
    extra = {'create_form':form}
    return render_to_response('codernote/note_create.html', extra)

def note_info_all(request):
    pass

def note_info(request, slug=None):
    pass


def note_delete(request, slug=None):
    pass

def note_upgrade(request, slug=None):
    pass


""" Non-Authenticated Views """

def front(request):
    pass

def about(request):
    pass

def help(request):
    pass


""" Config """

def config(request):
    pass


""" Rendering """

def render_markdown(request):
    pass

def render_textile(request):
    pass

def render_syntax(request):
    pass
