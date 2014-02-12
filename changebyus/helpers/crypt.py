# -*- coding: utf-8 -*-
"""
    :copyright: (c) 2013 Local Projects, all rights reserved
    :license: Affero GNU GPL v3, see LICENSE for more details.
"""

"""
    Helpers for handling some common encryption functions    
"""

from .encryption import aes_encrypt, aes_decrypt
from flask import current_app as app

def handle_initial_encryption(document, encrypted_fields):

    if app.config['ENCRYPTION']['ENABLED']:

        for key in encrypted_fields:
            if hasattr(document, key):
                field = getattr(document, key)
                field = aes_encrypt(field, 
                                    app.config['ENCRYPTION']['KEY'], 
                                    app.config['ENCRYPTION']['IV'])
                setattr(document, key, field)

def handle_update_encryption(document, encrypted_fields):
    if app.config['ENCRYPTION']['ENABLED']:

        for key in encrypted_fields:
            if hasattr(document, key):
                if key in document.__dict__['_changed_fields']:
                    field = getattr(document, key)
                    field = aes_encrypt(field, 
                                        app.config['ENCRYPTION']['KEY'], 
                                        app.config['ENCRYPTION']['IV'])
                    setattr(document, key, field)                        

def handle_decryption(document, encrypted_fields):
    if app.config['ENCRYPTION']['ENABLED']:

        # only decrypted saved docs
        if document.id is not None:

            for key in encrypted_fields:
                if hasattr(document, key):
                    field = getattr(document, key)
                    field = aes_decrypt(field, 
                                        app.config['ENCRYPTION']['KEY'], 
                                        app.config['ENCRYPTION']['IV'])
                    setattr(document, key, field)
