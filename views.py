from models import Note
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.shortcuts import render_to_response


""" Note """

def note_list(request):
    'Non-Ajax view.'
    return render_to_response('codernote/note_list.html')

def note_detail(request):
    'Non-Ajax view.'
    pass

def note_info_all(request):
    pass

def note_info(request, slug=None):
    pass

def note_create(request, slug=None):
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
