from django.db import models

class Note(models.Model):
    # Title of note.
    title = models.CharField(max_length=200)
    # Note's slug for its URL.
    slug = models.SlugField(max_length=200)
    # Tags for classifying note.
    tags = models.CharField(max_length=200)
    # The body of the note.
    text = models.TextField(blank=True, null=True)
    # When the note was created.
    created = models.DateTimeField(auto_now_add=True)
    # When the note 'started'. User definable.
    start = models.DateTimeField(blank=True, null=True)
    # When the note 'ended'. User definable. If there
    # is no end date, then a project is 'ongoing'
    end = models.DateTimeField(blank=True, null=True)
    
    # Typing Notes (text, snippet, etc)
    type = models.CharField(max_length=200)
    # For text, the markup. For snippet, programming language.
    type_detail = models.CharField(max_length=200)

    def get_absolute_url(self):
        return u"/n/%s/" % self.slug

    def __unicode__(self):
        return u"Note(%s, %s)" % (self.title, self.created)

    
    
