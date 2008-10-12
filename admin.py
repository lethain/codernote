from django.contrib import admin
from models import *

class NoteAdmin(admin.ModelAdmin):
    model = Note

admin.site.register(Note, NoteAdmin)
admin.site.register(HashPublish)
admin.site.register(AppInvite)
