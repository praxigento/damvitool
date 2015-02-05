from damvitool.db_app import dbApp
from morepath.security import Identity
from morepath.compat import bytes_
import binascii
import base64
import uuid
from datetime import datetime
from webob.exc import HTTPForbidden

__author__ = 'alex-smirnov'

session_timeout = 600  # seconds


class Session:
    def __init__(self, username):
        self.username = username
        self.sessionId = str(uuid.uuid1())
        self.lastActivity = self.createTime = datetime.utcnow()


class Users:
    users = dict()
    no_auth = False

    @classmethod
    def load(cls, file):
        for l in file.readlines():
            l = l.strip()
            if not l:
                continue
            data = l.split('=', 1)
            cls.users[data[0].strip()] = {'password': data[1].strip(), 'sessions': dict()}

    @classmethod
    def check(cls, username, password):
        # accept, if no users loaded
        if cls.no_auth:
            return True

        if not username or not password:
            return False
        return (cls.users.get(username, dict()).get('password') == password)

    @classmethod
    def createSession(cls, username):
        if cls.no_auth:
            return Session(username)

        session = Session(username)
        cls.users[username]['sessions'][session.sessionId] = session
        return session

    @classmethod
    def checkSession(cls, username, sessionId):
        # accept, if no users loaded
        if cls.no_auth:
            return True

        if not username or not sessionId:
            return False
        if (username in cls.users) and (sessionId in cls.users.get(username)['sessions']):
            s = cls.users.get(username)['sessions'][sessionId]
            now = datetime.utcnow()
            if (now - s.lastActivity).total_seconds() < session_timeout:
                s.lastActivity = now
                return True
            else:
                del cls.users[username]['sessions'][sessionId]
        return False

    @classmethod
    def dropSession(cls, username, sessionId):
        if not username or not sessionId:
            return False
        if (username in cls.users) and (sessionId in cls.users[username]['sessions']):
            del cls.users[username]['sessions'][sessionId]
            return True
        return False


class DamvitoolAuthInfo(object):
    def __init__(self, username, sessionId):
        self.username = username
        self.sessionId = sessionId


class DamvitoolAuthIdentityPolicy(object):
    """Identity policy that uses damvitool HTTP Authentication.
    """

    def identify(self, request):
        """Establish claimed identity using request.

        :param request: Request to extract identity information from.
        :type request: :class:`morepath.Request`.
        :returns: :class:`morepath.security.Identity` instance.
        """
        try:
            authorization = request.authorization
        except ValueError:
            return None
        if authorization is None:
            return None
        authtype, params = authorization
        auth = parse_auth(authtype, params)
        if auth is None:
            return None
        return Identity(userid=auth.username, sessionId=auth.sessionId)

    def remember(self, response, request, identity):
        """Remember identity on response.

        This is a no-op for basic auth, as the browser re-identifies
        upon each request in that case.

        :param response: response object on which to store identity.
        :type response: :class:`morepath.Response`
        :param request: request object.
        :type request: :class:`morepath.Request`
        :param identity: identity to remember.
        :type identity: :class:`morepath.security.Identity`
        """

    def forget(self, response, request):
        """Forget identity on response.

        This causes the browser to issue a basic authentication
        dialog.  Warning: for basic auth, the browser in fact does not
        forget the information even if ``forget`` is called.

        :param response: response object on which to forget identity.
        :type response: :class:`morepath.Response`
        :param request: request object.
        :type request: :class:`morepath.Request`

        """
        response.headers.add('WWW-Authenticate',
                             'Basic realm="%s"' % self.realm)


def parse_auth(authtype, params):
    # try:
    # authtype, params = parse_auth(value)
    # except ValueError:
    # return None

    if authtype != 'Basic':
        return None
    try:
        authbytes = b64decode(params.strip())
    except (TypeError, binascii.Error):  # can't decode
        return None

    # try utf-8 first, then latin-1; see discussion in
    # https://github.com/Pylons/pyramid/issues/898
    try:
        auth = authbytes.decode('utf-8')
    except UnicodeDecodeError:
        # might get nonsense but normally not get decode error
        auth = authbytes.decode('latin-1')

    try:
        username, sessionId = auth.split(':', 1)
    except ValueError:  # not enough values to unpack
        return None

    return DamvitoolAuthInfo(username, sessionId)


def b64decode(v):
    return base64.b64decode(bytes_(v))


@dbApp.identity_policy()
def get_identity_policy():
    return DamvitoolAuthIdentityPolicy()


@dbApp.verify_identity()
def verify_identity(identity):
    return Users.checkSession(identity.userid, identity.sessionId)


@dbApp.permission_rule(model=object, permission=object)
def all_permission(identity, model, permission):
    return True


class Login:
    pass


@dbApp.path(model=Login, path='login')
def get_login():
    return Login()


@dbApp.json(model=Login, request_method='POST')
def login(self, request):
    credentials = request.json
    if Users.check(credentials['username'], credentials['password']):
        session = Users.createSession(credentials['username'])
        return {'username': credentials['username'], 'sessionId': session.sessionId}
    raise HTTPForbidden()


class Logout:
    pass


@dbApp.path(model=Logout, path='logout')
def get_logout():
    return Logout()


@dbApp.json(model=Logout, request_method='POST', permission=object)
def logout(self, request):
    credentials = request.identity
    Users.dropSession(credentials.userid, credentials.sessionId)
    return {}
