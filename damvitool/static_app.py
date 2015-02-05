from more.transaction import transaction_app
from static import Cling
import os

__author__ = 'alex-smirnov'

class StaticApp(transaction_app):
    def __init__(self):
        super(StaticApp, self).__init__()
        self.static = Cling(os.path.dirname(__file__) + '/static/')

    def __call__(self, environ, start_response):
        request = self.request(environ)
        response = self.publish(request)
        if response.status_code == 404:
            response = self.static.__call__(environ, start_response)
            return response
        return response(environ, start_response)
