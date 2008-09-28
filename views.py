# Create your views here.



""" Note """

def note_list(request):
    'Non-Ajax view.'
    pass

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


""" Tags """

def tag_info_all(request):
    pass

def tag_info(request):
    pass

def tag_create(request):
    pass

def tag_delete(request):
    pass

def tag_upgrade(request):
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
