from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',
    # Non-Ajax General Views
    (r'^config/$', 'codernote.views.config'),
    (r'^about/$', 'codernote.views.about'),
    (r'^help/$', 'codernote.views.help'),


    # Note Ajax Views
    (r'^note/info_all/$', 'codernote.views.note_info_all'),
    (r'^note/info/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_info'),
    (r'^note/delete/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_delete'),
    (r'^note/update/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_update'),
    (r'^note/render/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_render'),

    # Note Non-Ajax Views
    (r'^note/create/', 'codernote.views.note_create'),
    (r'^n/(?P<slug>[-\w]+)/$','codernote.views.note_detail'),
    (r'^$', 'codernote.views.note_list'),
)

