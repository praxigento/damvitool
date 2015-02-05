__author__ = 'alex-smirnov'

import pytest
from damvitool.db import generate_orm_classes

conn_str = 'sqlite:///./Chinook_Sqlite.sqlite'


@pytest.fixture(scope='session')
def orm(request):
    # conn_str = getattr(request.module, 'conn_str', None)
    if not conn_str:
        return False
    generate_orm_classes(conn_str)
    return True
