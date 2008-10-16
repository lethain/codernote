from django.core.management.base import NoArgsCommand
from codernote.models import Note
import datetime

class Command(NoArgsCommand):
    help='Removes excessive Reversion history for Notes.',
    args=''

    def handle_noargs(self, **options):
        """
        Keep revisions with a kind of exponential backoff.
        Keep the first revision 60 seconds old, then 60*60,
        then 60 * 60 * 60, 

        """
        print "Removing excessive revision history..."
        max_age = 60000
        notes = Note.objects.select_related().all()
        remove = 0
        now = datetime.datetime.now()
        for note in notes:
            backoff = 60
            cutoff = datetime.timedelta(seconds=backoff)
            for rev in note.history.all():
                diff = now - rev._audit_timestamp
                if backoff > max_age or diff < cutoff:
                    rev.delete()
                    remove = remove + 1
                else:
                    backoff = backoff * 10
                    cutoff = datetime.timedelta(seconds=backoff)
        print "Removed %d revisions." % remove
