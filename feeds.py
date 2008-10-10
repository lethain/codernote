from django.contrib.syndication.feeds import Feed
from codernote.models import FlowPublish
from django.contrib.auth.models import User

class LatestNotes(Feed):
    def get_object(self, bits):
        if len(bits) != 1:
            raise ObjectDoesNotExist
        return User.objects.get(username__exact=bits[0])

    def title(self, obj):
        return u"Notes from %s" % obj.username

    def link(self, obj):
        return u"/flow/%s/" % obj.username

    def description(self, obj):
        return u"Feed for recent notes from %s" % obj.username

    def items(self, obj):
        return FlowPublish.objects.filter(user=obj)

    def item_pubdate(self, item):
        return item.note.created


        
