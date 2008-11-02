from django.conf.urls.defaults import *
from feeds import LatestNotes


feeds = {
    'flow':LatestNotes,
}

urlpatterns = patterns(
    '',
    # Non-Ajax General Views
    (r'^config/$', 'codernote.views.config'),
    (r'^about/$', 'codernote.views.about'),
    (r'^help/$', 'codernote.views.help'),
    (r'skin/bw/', 'codernote.views.select_bw_skin'),
    (r'skin/blue/', 'codernote.views.select_blue_skin'),
    (r'skin/dark/', 'codernote.views.select_dark_skin'),

    # Note Ajax Views
    (r'^note/sticky/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_sticky'),
    (r'^note/unsticky/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_unsticky'),
    (r'^note/info_all/$', 'codernote.views.note_info_all'),
    (r'^note/info/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_info'),
    (r'^note/delete/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_delete'),
    (r'^note/update/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_update'),
    (r'^note/render/(?P<slug>[-\w]+)?/?$', 'codernote.views.note_render'),
    (r'^note/revisions/$', 'codernote.views.note_revisions'),
    (r'^note/revision/delete/$', 'codernote.views.note_revision_delete'),
    (r'^note/revision/revert/$', 'codernote.views.note_revision_revert'),

    # Publishing Views
    (r'^share/(?P<slug>[-\w_]+)/(?P<username>[-\w_]*)/?$','codernote.views.share_note'),
    (r'^publish/flow/(?P<slug>[-\w]+)/$','codernote.views.flow_publish'),
    (r'^unpublish/flow/(?P<slug>[-\w]+)/$','codernote.views.flow_unpublish'),
    (r'^publish/hash/(?P<slug>[-\w]+)/$','codernote.views.hash_publish'),
    (r'^unpublish/hash/(?P<slug>[-\w]+)/$','codernote.views.hash_unpublish'),
    (r'^flow/(?P<user>[-\w_]+)/$','codernote.views.public_flow'),
    (r'^feed/(?P<url>.*)/$', 'django.contrib.syndication.views.feed',
     {'feed_dict':feeds}),
    (r'^flow/(?P<user>[-\w_]+)/(?P<slug>[-\w_]+)/$','codernote.views.public_flow_detail'),
    (r'^hash/(?P<hash>\w+)/$','codernote.views.public_hash'),

    # Note Non-Ajax Views
    (r'^note/create/', 'codernote.views.note_create'),
    (r'^n/(?P<slug>[-\w]+)/$','codernote.views.note_detail'),
    (r'^$', 'codernote.views.note_list'),

    # Note Invites
    (r'^note/invites/$','codernote.views.note_manage_invites'),
    (r'^note/invites/accept/(?P<pk>\d+)/$','codernote.views.note_accept_invite'),
    (r'^note/invites/reject/(?P<pk>\d+)/$','codernote.views.note_reject_invite'),

    # Checking for user existance
    (r'^user/exists/(?P<username>[-\w_]+)/$','codernote.views.user_exists'),

)

