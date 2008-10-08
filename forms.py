from django.forms import ModelForm
from models import Note

class NoteForm(ModelForm):
    class Meta:
        model = Note
        exclude = ['owners','start', 'end', 'text', 'created', 'type', 'type_detail', 'slug',]
