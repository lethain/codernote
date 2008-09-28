from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',
    # Non-Ajax General Views
    (r'config/', 'codernote.views.config'),
    (r'about/', 'codernote.views.about'),
    (r'help/', 'codernote.views.help'),

    # Rendering
    (r'render/markdown/$', 'codernote.views.render_markdown'),
    (r'render/textile/$', 'codernote.views.render_textile'),
    (r'render/syntax/$', 'codernote.views.render_syntax'),

    # Note Ajax Views
    (r'note/info_all/$', 'codernote.views.note_info_all'),
    (r'note/info/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_info'),
    (r'note/create/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_create'),
    (r'note/delete/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_delete'),
    (r'note/update/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_update'),
    
    # Tag Ajax Views
    (r'tag/info_all/$', 'codernote.views.tag_info_all'),
    (r'tag/info/$', 'codernote.views.tag_info'),
    (r'tag/create/$', 'codernote.views.tag_create'),
    (r'tag/delete/$', 'codernote.views.tag_delete'),
    (r'tag/update/$', 'codernote.views.tag_upgrade'),

    # Note Non-Ajax Views
    (r'note/(?P<slug>[-\w]+)/$','codernote.views.note_detail'),
    (r'$', 'codernote.views.note_list'),
)

