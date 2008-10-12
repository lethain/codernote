from models import Note, HashPublish, FlowPublish, NoteInvite
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.shortcuts import render_to_response
from forms import NoteForm
from django.core import serializers
from datetime import datetime
from django.contrib.auth.models import User
import re, md5, time
from pygments.lexers import get_all_lexers
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page

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
        fields = ('owners','title','slug','tags','created','start','end','type')
        serialized = serializers.serialize("json", notes,fields=fields)
        invite_count = NoteInvite.objects.filter(user=request.user).count()
        extra = {'serialized':serialized, 'invites':invite_count }

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
    if note.owners.all().count() == 1:
        note.delete()
        NoteInvite.objects.filter(note=note).delete()
    else:
        note.owners.remove(request.user)
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

""" Managing Note Invitations """

#     (r'^note/invites/','codernote.views.note_manage_invites'),

@login_required
def note_manage_invites(request):
    invites = NoteInvite.objects.filter(user=request.user)
    extra = {'obj_list':invites}
    return render_to_response('codernote/manage_invites.html',
                              extra,
                              context_instance=RequestContext(request))


""" Non-Authenticated Views """

@cache_page(60 * 30)
def about(request):
    return render_to_response('codernote/about.html',
                              context_instance=RequestContext(request))

@cache_page(60 * 30)
def help(request):
    return render_to_response('codernote/help.html',
                              context_instance=RequestContext(request))

""" Utility Methods """

def user_exists(request, username):
    if User.objects.filter(username=username).count() > 0:
        return HttpResponse("Exists.")
    else:
        return HttpResponseServerError("Doesn't exist.")

""" Config """

@login_required
def config(request):
    pass

""" Publishing """

@login_required
def share_note(request, slug, username):
    try:
        note = Note.objects.filter(owners=request.user).get(slug=slug)
    except:
        return HttpResponseServerError("Failed to retrieve note.")
    try:
        user = User.objects.get(username=username)
    except:
        return HttpResponseServerError("Invalid username.")
    NoteInvite.objects.create(user=user, note=note, sender=request.use)
    #note.owners.add(user)
    #note.save()
    return HttpResponse("Successful.")


@login_required
def flow_publish(request, slug):
    try:
        note = Note.objects.filter(owners=request.user).get(slug=slug)
    except:
        return HttpResponseServerError("Failed to retrieve note.")
    x = FlowPublish(note=note, user=request.user)
    x.save()
    return HttpResponse(x.get_absolute_url())

@login_required
def flow_unpublish(request, slug):
    FlowPublish.objects.filter(user=request.user).filter(note__slug=slug).delete()
    return HttpResponse("Deleted.")

@login_required
def hash_publish(request, slug):
    try:
        note = Note.objects.filter(owners=request.user).get(slug=slug)
    except:
        return HttpResponseServerError("Failed to retrieve note.")
    hash = md5.md5("%s%s" % (time.time(), note.title)).hexdigest()[:20]
    x = HashPublish(note=note, hash=hash, user=request.user)
    x.save()
    return HttpResponse(hash)

@login_required
def hash_unpublish(request, slug):
    HashPublish.objects.filter(user=request.user).filter(note__slug=slug).delete()
    return HttpResponse("Deleted.")

@cache_page(60 * 30)
def public_hash(request, hash):
    pub = HashPublish.objects.get(hash=hash)
    return render_to_response('codernote/public_hash.html',
                              {'object':pub.note},
                              context_instance=RequestContext(request))

@cache_page(60 * 30)
def public_flow(request, user):
    pub = FlowPublish.objects.filter(user__username=user)
    user = User.objects.get(username=user)
    return render_to_response('codernote/public_flow.html',
                              {'objects':pub, 'writer':user},
                              context_instance=RequestContext(request))

@cache_page(60 * 30)
def public_flow_detail(request, user, slug):
    pub = FlowPublish.objects.filter(user__username=user).filter(note__slug=slug)[0]
    return render_to_response('codernote/public_flow_detail.html',
                              {'object':pub.note,'writer':pub.user},
                              context_instance=RequestContext(request))
