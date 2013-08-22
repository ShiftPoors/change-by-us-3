# -*- coding: utf-8 -*-
"""
    :copyright: (c) 2013 Local Projects, all rights reserved
    :license: Affero GNU GPL v3, see LICENSE for more details.
"""
from flask import Blueprint, current_app

import requests
import yaml
import os
import inspect
import requests
import urllib

from sets import Set

from ..user.models import User, UserNotifications
from ..project.models import Project
from ..post.models import ProjectPost

notifications_api = Blueprint('notificiations_api', __name__, url_prefix='/api/notifications')

BASE_URL = 'https://api-ssl.bitly.com'

"""
=========================
Bit.ly Webservice Wrapper
=========================

This is a webservice that will send large urls to bitly and return the 
shortened url.  The use case is rather obvious.
"""

def _notify_project_join(project_id=None):
    """
    Just notify the project owner of a join.

    Possibly in the future we want to notify organizers as well
    """
    project = Project.objects.with_id( project_id )
    if project is None:
        return False

    owner = project.owner
    if owner.notifications.joins_my_project and owner.email:
        pass
        #email..

"""
@post_api.route('/tester')
def test_send_email():
    msg = Message("Hello",
                  recipients=["lucasvickers@gmail.com"],
                  sender=(current_app.config['DEFAULT_MAIL_SENDER_NAME'],
                          current_app.config['DEFAULT_MAIL_SENDER']))

    msg.body = "hi"
    msg.html = "<b>html</b>"
    current_app.mail.send(msg)

    return True
"""

def _notify_post_response(post_id=None):
    """
    Notify the original poster and all poster responders that there's been
    another response
    """
    
    newest_post = ProjectPost.objects.with_id(post_id)
    if newest_post is None:
        return False

    if newest_post.parent_id:
        original_post = ProjectPost.objects.with_id(newest_post.parent_id)
    else:
        original_post = newest_post

    if original_post is None:
        return False


    # unique set
    users = Set()
    for response in original_post.responses:
        users.add( response.user )

    # don't notify the poster
    users.remove( newest_post.user )

    post_url = current_app.settings['BASE_URL'] + url_for('project.project_view_id', project_id = original_post.project.id)

    for user in users:
        if user.notifications.responds_to_my_post and user.email:
            msg = Message('There was a response to "{0}" on ChangeByUs'.format(original_post.title))
            msg.body = "Hello {0}\n".format(user.first_name)
            msg.body += "There was a response to the post on ChangeByUs, titled {0}\n\n".format(original_post.title)
            msg.body += "Post by {0}: \n {1}\n\n".format(newest_post.user.display_name)
            msg.body += "To view in ChangeByUs, please go to {0}".format(post_url)







