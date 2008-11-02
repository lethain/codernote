from django.forms import ModelForm
from models import Note

class NoteForm(ModelForm):
    class Meta:
        model = Note
        exclude = ['sticky','owners','start', 'end', 'text', 'created', 'type', 'type_detail', 'slug',]
