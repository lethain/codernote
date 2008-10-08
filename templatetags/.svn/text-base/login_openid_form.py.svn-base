# (c) Copyright 2007 Thomas Bohmbach, Jr.  All Rights Reserved. 
#
# See the LICENSE file that should have been included with this distribution
# for more specific information.

from django.contrib.auth import REDIRECT_FIELD_NAME
from django.template import Library

from openid_auth.forms import OpenIDLoginForm, OPENID_FORM_FIELD_NAME, NEXT_FORM_FIELD_NAME


register = Library()

@register.inclusion_tag('accounts/tag/login_openid_form.html', takes_context=True)
def login_openid_form(context):
    openid_form = context.get('openid_form', None)
    if not openid_form:
        openid_url = context.get(OPENID_FORM_FIELD_NAME, 'http://')
        next = context.get(NEXT_FORM_FIELD_NAME, '')
        if not next:
            next = context.get(REDIRECT_FIELD_NAME, '')
        openid_form = OpenIDLoginForm(initial={OPENID_FORM_FIELD_NAME : openid_url,
                                               NEXT_FORM_FIELD_NAME : next})
    return {'openid_form' : openid_form}