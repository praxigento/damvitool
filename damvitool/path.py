from damvitool.main import DamvitoolApp
from damvitool.model import Root, Database, Table, Record, UniGridRequest

__author__ = 'alex-smirnov'


@DamvitoolApp.path(model=Root, path='')
def get_root():
    return Root()


@DamvitoolApp.path(model=Database, path='database')
def get_database():
    return Database()


@DamvitoolApp.path(model=Table, path='database/tables/{table_name}', variables=lambda model: dict(table_name=model.name))
def get_table(table_name):
    return Table(table_name)


@DamvitoolApp.path(model=Record, path='database/tables/{table_name}/recs/{id}',
          variables=lambda model: dict(table_name=model.table_name, id='[' + ','.join(str(i) for i in model.ids) + ']'))
def get_record(table_name, id):
    return Record(table_name, id)


@DamvitoolApp.path(model=UniGridRequest, path='database/uni-grid-request')
def get_uni_grid_request():
    return UniGridRequest()
