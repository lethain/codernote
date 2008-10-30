from django.db import models
import markdown, textile
from docutils.core import publish_parts
from django.contrib.auth.models import User
from pygments.lexers import get_all_lexers, get_lexer_by_name, DiffLexer
from pygments.formatters import HtmlFormatter
from pygments import highlight
from codernote import audit

def find_lexer(name):
    'Find a Pygments lexer using its human readable name.'
    for lexer in get_all_lexers():
        if lexer[0] == name:
            return lexer[1][0]

def render_snippet(txt, lexer):
    lexer = get_lexer_by_name(find_lexer(lexer))
    return highlight(txt,lexer,HtmlFormatter())

def smart_str(s, encoding='utf-8', errors='strict'):
    """
    Returns a bytestring version of 's', encoded as specified in 'encoding'.
    Borrowed and simplified for this purpose from `django.utils.encoding`.
    """
    if not isinstance(s, basestring):
        try:
            return str(s)
        except UnicodeEncodeError:
            return unicode(s).encode(encoding, errors)
    elif isinstance(s, unicode):
        return s.encode(encoding, errors)
    elif s and encoding != 'utf-8':
        return s.decode('utf-8', errors).encode(encoding, errors)
    else:
        return s

class Note(models.Model):
    # Users with access to note.
    owners = models.ManyToManyField(User, related_name="notes")
    # Title of note.
    title = models.CharField(max_length=200, help_text="The note's title.")
    # Note's slug for its URL.
    slug = models.SlugField(max_length=200, help_text="The note's slug.")
    # Tags for classifying note.
    tags = models.CharField(max_length=200, help_text="Separate by commas or spaces.")
    # The body of the note.
    text = models.TextField()
    # When the note was created.
    created = models.DateTimeField(auto_now_add=True, help_text="")
    # When the note 'started'. User definable.
    start = models.DateTimeField(blank=True, null=True, help_text="Date when note begins. (Can leave blank.)")
    # When the note 'ended'. User definable. If there
    # is no end date, then a project is 'ongoing'
    end = models.DateTimeField(blank=True, null=True, help_text="Date when note ends. (Can leave blank.)")
    # Typing Notes (text, snippet, etc)
    type = models.CharField(max_length=200)
    # For text, the markup. For snippet, programming language.
    type_detail = models.CharField(max_length=200)
    history = audit.AuditTrail()
    # Whether or not a note ignores sorting
    sticky = models.BooleanField(default=True)

    def render_text(self):
        if self.type == "markdown":
            return markdown.markdown(self.text)
        elif self.type == "textile":
            return textile.textile(smart_str(self.text), encoding='utf-8',output='utf-8')
        elif self.type == "rest":
            return publish_parts(source=self.text,
                                               writer_name="html4css1")["fragment"]
        elif self.type == "snippet":
            try:
                return render_snippet(self.text, self.type_detail)
            except:
                return self.text
        else:
            return "<pre class='plain'>%s</pre>" % self.text

    def is_shared(self):
        return self.owners.all().count() > 1

    def get_absolute_url(self):
        return u"/n/%s/" % self.slug

    def __unicode__(self):
        return u"Note(%s, %s)" % (self.title, self.created)


class FlowPublish(models.Model):
    note = models.ForeignKey(Note)
    user = models.ForeignKey(User)

    def get_absolute_url(self):
        return u"/flow/%s/%s/" % (self.user.username, self.note.slug)
    
class HashPublish(models.Model):
    note = models.ForeignKey(Note)
    user = models.ForeignKey(User)
    hash = models.CharField(max_length=20)

    def get_absolute_url(self):
        return u"/hash/%s/" % self.hash

class NoteInvite(models.Model):
    "Intermediate step between sharing and receiving a note. "
    note = models.ForeignKey(Note)
    user = models.ForeignKey(User)
    sender = models.ForeignKey(User, related_name="sender")

class AppInvite(models.Model):
    password = models.CharField(max_length=10)
    max = models.IntegerField()
    current = models.IntegerField()
