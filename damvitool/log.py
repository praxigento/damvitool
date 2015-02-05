__author__ = 'alex-smirnov'
import morepath
from damvitool.static_app import StaticApp
import traceback
import logging
import time
from webob.exc import HTTPNotFound


@StaticApp.tween_factory(under=morepath.EXCVIEW)
def error_tween_factory(app, handler):
    def error_tween(request):
        """Intercepts exception, print info and reraise

        """
        try:
            return handler(request)
        except Exception as e:
            if not isinstance(e, HTTPNotFound):
                logging.warning(traceback.format_exc())
            raise e

    return error_tween


@StaticApp.tween_factory(over=morepath.EXCVIEW)
def log_tween_factory(app, handler):
    format = ('%(REMOTE_ADDR)s - %(REMOTE_USER)s [%(time)s] '
              '"%(REQUEST_METHOD)s %(REQUEST_URI)s %(HTTP_VERSION)s" '
              '%(status)s %(bytes)s "%(HTTP_REFERER)s" "%(HTTP_USER_AGENT)s"')

    def log_tween(request):
        """Intercepts exception, print info and reraise

        """
        response = handler(request)

        if time.daylight:
            offset = time.altzone / 60 / 60 * -100
        else:
            offset = time.timezone / 60 / 60 * -100
        if offset >= 0:
            offset = "+%0.4d" % (offset)
        elif offset < 0:
            offset = "%0.4d" % (offset)
        d = {
            'REMOTE_ADDR': request.remote_addr or '-',
            'REMOTE_USER': request.remote_user or '-',
            'REQUEST_METHOD': request.method,
            'REQUEST_URI': request.url,
            'HTTP_VERSION': request.http_version or '-',
            'time': time.strftime('%d/%b/%Y:%H:%M:%S ', time.localtime()) + offset,
            'status': response.status.split(None, 1)[0],
            'bytes': request.content_length or '-',
            'HTTP_REFERER': request.referrer or '-',
            'HTTP_USER_AGENT': request.user_agent or '-',
        }
        message = format % d
        logging.info(message)

        return response

    return log_tween
