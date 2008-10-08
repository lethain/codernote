from models import Note
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.shortcuts import render_to_response
from forms import NoteForm
from django.core import serializers
from datetime import datetime
import re
from pygments.lexers import get_all_lexers
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

LEXERS = sorted([ tuple[0] for tuple in get_all_lexers() ])


""" Utilities """

def slugify(string):
    string = re.sub('\s+', '_', string)
    string = re.sub('[^\w.-]', '', string)
    return string.strip('_.- ').lower()


def find_slug_for(string):
    i = 0
    new_str = string
    while (Note.objects.filter(slug=new_str).count() > 0):
        new_str = u"%s%s" % (string, i)
        i = i + 1
    return new_str

def make_tags_uniform(string):
    return string.replace(", "," ").replace("  "," ").replace(" ",", ")


""" Note """

def note_list(request):
    'Non-Ajax view.'
    if request.user.is_authenticated():
        notes = Note.objects.filter(owners=request.user)
        extra = {'serialized':serializers.serialize("json", notes) }
    else:
        extra = {}
    return render_to_response('codernote/note_list.html', extra, 
                              context_instance=RequestContext(request))

@login_required
def note_detail(request, slug):
    'Non-Ajax view.'
    note = Note.objects.filter(owners=request.user).get(slug=slug)
    extra = {'object':note, 'lexers':LEXERS}
    return render_to_response('codernote/note_detail.html', extra,
                              context_instance=RequestContext(request))

@login_required
def note_create(request):
    'Non-Ajax view.'
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            new_note = form.save(commit=False)
            new_note.slug = find_slug_for(slugify(new_note.title))
            new_note.tags = make_tags_uniform(new_note.tags)
            new_note.save()
            new_note.owners = [request.user]
            form.save_m2m()
            return HttpResponseRedirect(new_note.get_absolute_url())
    else:
        form = NoteForm()
    extra = {'create_form':form}
    return render_to_response('codernote/note_create.html', extra)

@login_required
def note_info_all(request):
    pass

@login_required
def note_info(request, slug=None):
    pass

@login_required
def note_delete(request, slug=None):
    if slug is None:
        if request.POST.has_key('slug'):
            slug = request.POST['slug']
        else:
            return HttpResponseServerError('Failed to supply a slug.')
    try:
        note = Note.objects.filter(owners=request.user).get(slug=slug)
    except:
        return HttpResponse("Failed to retrieve note.")
    note.delete()
    return HttpResponseRedirect("/")

@login_required
def note_update(request, slug=None):
    if slug is None:
        if request.POST.has_key('slug'):
            slug = request.POST['slug']
        else:
            return HttpResponseServerError('Failed to supply a slug.')
    try:
        note = Note.objects.filter(owners=request.user).get(slug=slug)
    except:
        return HttpResponse("Failed to retrieve note.")
    updated = []
    if request.POST.has_key('title'):
        note.title = request.POST['title']
        updated.append('title')
    if request.POST.has_key('tags'):
        note.tags = make_tags_uniform(request.POST['tags'])
        updated.append('tags')
    if request.POST.has_key('text'):
        note.text = request.POST['text']
        updated.append('text')
    if request.POST.has_key('type'):
        note.type = request.POST['type']
        updated.append('type')
    if request.POST.has_key('type_detail'):
        note.type_detail = request.POST['type_detail']
        print note.type_detail
        updated.append('type detail')
    if request.POST.has_key('start'):
        raw = request.POST['start'].split('/')
        year = int(raw[2])
        month = int(raw[0])
        day = int(raw[1])
        note.start = datetime(year, month, day)
        updated.append('start date')
    if request.POST.has_key('end'):
        raw = request.POST['end'].split('/')
        year = int(raw[2])
        month = int(raw[0])
        day = int(raw[1])
        note.end = datetime(year, month, day)
        updated.append('end date')
    note.save()

    msg = "Updated %s." % ", ".join(updated)
    return HttpResponse(msg)
    
@login_required
def note_render(request, slug=None):
    if slug is None:
        if request.POST.has_key('slug'):
            slug = request.POST['slug']
        else:
            return HttpResponseServerError('Failed to supply a slug.')
    try:
        note = Note.objects.filter(owners=request.user).get(slug=slug)
    except:
        return HttpResponse("Failed to retrieve note.")
    return HttpResponse(note.render_text())


""" Non-Authenticated Views """

def front(request):
    pass

def about(request):
    pass

def help(request):
    pass


""" Config """

@login_required
def config(request):
    pass
