__author__ = 'alex-smirnov'

from damvitool.db import orm_classes


def test_db(orm):
    assert orm


def test_orm_classes_count(orm):
    assert len(orm_classes) == 11
