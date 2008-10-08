# (c) Copyright 2007 Thomas Bohmbach, Jr.  All Rights Reserved. 
#
# See the LICENSE file that should have been included with this distribution
# for more specific information.

from django import oldforms
from django.contrib.auth.forms import AuthenticationForm
from django.template import Library

from openid_auth.forms import OpenIDLoginForm


register = Library()

@register.inclusion_tag('accounts/tag/login_auth_form.html', takes_context=True)
def login_auth_form(context):
    auth_form = context.get('form', None)
    next = context.get('next', '')
    if not auth_form:
        username = context.get('username', '')
        password = context.get('password', '')
        manipulator = AuthenticationForm(context)
        auth_form = oldforms.FormWrapper(AuthenticationForm(context), None, None)
    return {'form' : auth_form,
            'next' : next}
