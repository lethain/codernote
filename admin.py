from django.contrib import admin
from models import Note

class NoteAdmin(admin.ModelAdmin):
    model = Note


admin.site.register(Note, NoteAdmin)
