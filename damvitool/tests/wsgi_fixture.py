__author__ = 'alex-smirnov'

import pytest
import morepath
import damvitool
from damvitool.main import staticApp
from damvitool.users import Users


@pytest.fixture(scope='session')
def wsgi(orm):
    Users.load()

    # morepath.autosetup()
    c = morepath.setup()
    c.scan(damvitool)
    c.commit()

    return staticApp
