from json import dumps
from damvitool.utils import to_json_type
from morepath import redirect, Response, NO_IDENTITY, Identity
from damvitool.main import DamvitoolApp
from damvitool.model import Root, Database, Table, Record, UniGridRequest
from webob.exc import HTTPException

__author__ = 'alex-smirnov'


@DamvitoolApp.json(model=Root)
def root_default(self, request):
    return self.get_schema(request)


@DamvitoolApp.json(model=Database, permission=Identity)
def database(self, request):
    return self.get_schema(request)


@DamvitoolApp.json(model=Database, name='mode', permission=Identity)
def database_mode(self, request):
    """Get database MODE data

    """
    return self.get_mode()


@DamvitoolApp.json(model=Table, permission=Identity)
def tables(self, request):
    return {
        'data': [request.view(Record.from_object(r)) for r in self.select()],
        'add': request.link(self, 'add')
    }


@DamvitoolApp.json(model=Table, name='add', request_method='POST', permission=Identity)
def tables_add(self, request):
    """Add record to table with values form request body

    """
    r = self.add(request.json)
    return request.view(Record.from_object(r))


@DamvitoolApp.json(model=Record, permission=Identity)
def record(self, request):
    """Get json object with record data

    """
    obj = self.get()
    result_dict = {}
    for column in obj.__table__.columns.keys():
        result_dict[column] = to_json_type(getattr(obj, column, None))
    result_dict['__url__'] = request.link(self)

    # add links to related resources
    result_dict['__links__'] = dict()
    for foreign_key in obj.__table__.foreign_keys:
        column_names = foreign_key.constraint.columns
        column_values = [getattr(obj, column_name, None) for column_name in column_names]
        if [val for val in column_values if val]:
            table = foreign_key.column.table.name
            result_dict['__links__'][foreign_key.name or str(foreign_key)] = request.link(Record(table, column_values))

    return result_dict


@DamvitoolApp.json(model=Record, request_method='PATCH', permission=Identity)
def record_patch(self, request):
    """Upgrade record data

    """
    r = self.patch(request.json)
    return request.view(Record.from_object(r))


@DamvitoolApp.json(model=Record, request_method='PUT', permission=Identity)
def record_put(self, request):
    """Replace record data

    """
    r = self.replace(request.json)
    return request.view(Record.from_object(r))


@DamvitoolApp.json(model=Record, request_method='DELETE', permission=Identity)
def record_put(self, request):
    """Delete record

    """
    self.remove()
    return {}


@DamvitoolApp.json(model=UniGridRequest, request_method='POST', permission=Identity)
def uni_grid_request(self, request):
    return self.query(request.json)


@DamvitoolApp.json(model=UniGridRequest, name='summaries', request_method='POST', permission=Identity)
def uni_grid_request_summaries(self, request):
    return self.query_summaries(request.json)


@DamvitoolApp.view(model=UniGridRequest, name='export', request_method='POST', permission=Identity)
def uni_grid_request_export(self, request):
    return self.query_export(request.json)


@DamvitoolApp.view(model=Exception)
def error(self, request):
    """Error view

    Return json object with error description if code raise Exception exception
    """
    data = {
        'code': 500,
        'error': str(self)
    }
    return Response(dumps(data), content_type='application/json', status=500)


@DamvitoolApp.view(model=HTTPException)
def http_error(self, request):
    """HTTP error view

    If morepath or other code raise HTTPException exception, return json response with data about error
    """
    data = {
        'code': self.code,
        'error': str(self)
    }
    return Response(dumps(data), content_type='application/json', status=self.code)
