__author__ = 'alex-smirnov'

from pytest import raises
from webtest import TestApp
from base64 import b64encode

auth = None


def test_morepath_config(wsgi):
    assert wsgi


def test_login_request(wsgi):
    app = TestApp(wsgi)
    login_resp = app.post_json('/api/login', {'username': 'user1', 'password': 'password1'})
    globals()['auth'] = login_resp.json


def test_mode_request(wsgi):
    app = TestApp(wsgi)
    app.get('/api/database/mode', headers={
        'Authorization': 'Basic ' + str(b64encode(
            (auth.get('username') + ':' + auth.get('sessionId')).encode('ascii')).decode('ascii'))})


def test_uni_grid_request(wsgi):
    app = TestApp(wsgi)
    app.post_json('/api/database/uni-grid-request', {
        "unigrid": {
            "entities": [
                {
                    "attributes": [
                        {
                            "entity": {
                                "attributes": [
                                    {
                                        "entity": {
                                            "attributes": [
                                                {
                                                    "id": "Name",
                                                    "alias": "Track_4_Album_AlbumId_Artist_ArtistId_Name",
                                                    "selected": True
                                                }
                                            ],
                                            "id": "Artist",
                                            "relation": {"attr_parent": "ArtistId"}
                                        }
                                    },
                                    {
                                        "id": "Title",
                                        "alias": "Track_4_Album_AlbumId_Title",
                                        "selected": True
                                    }
                                ],
                                "id": "Album",
                                "relation": {"attr_parent": "AlbumId"}
                            }
                        },
                        {
                            "id": "Name",
                            "alias": "Track_4_Name",
                            "selected": True
                        }
                    ],
                    "id": "Track",
                    "relation": None
                }
            ],
            "where": {},
            "order": [],
            "offset": 0,
            "limit": 75
        }}, headers={
        'Authorization': 'Basic ' + str(b64encode(
            (auth.get('username') + ':' + auth.get('sessionId')).encode('ascii')).decode('ascii'))})


def test_logout_request(wsgi):
    app = TestApp(wsgi)
    app.post_json('/api/logout', {}, headers={
        'Authorization': 'Basic ' + str(b64encode(
            (auth.get('username') + ':' + auth.get('sessionId')).encode('ascii')).decode('ascii'))})
    app.post_json('/api/logout', {}, headers={
        'Authorization': 'Basic ' + str(b64encode(
            (auth.get('username') + ':' + auth.get('sessionId')).encode('ascii')).decode('ascii'))}, status=403)
    globals()['auth'] = None
