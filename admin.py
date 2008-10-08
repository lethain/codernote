from django.contrib import admin
from models import *

class NoteAdmin(admin.ModelAdmin):
    model = Note

class HashPublishAdmin(admin.ModelAdmin):
    model = HashPublish

admin.site.register(Note, NoteAdmin)
admin.site.register(HashPublish)
