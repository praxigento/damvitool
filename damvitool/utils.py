from datetime import datetime, date
from decimal import Decimal

__author__ = 'alex-smirnov'


def to_json_type(value):
    if isinstance(value, (Decimal, datetime, date)):
        return str(value)
    return value
