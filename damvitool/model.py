from morepath import Response
from sqlalchemy import func, or_, and_, not_, sql
from sqlalchemy.orm import class_mapper, aliased
from damvitool.db import Base, orm_classes, Session
from json import loads
from damvitool.users import Login, Logout
from damvitool.utils import to_json_type

__author__ = 'alex-smirnov'


class Root(object):
    def __init__(self):
        pass

    def get_schema(self, request):
        """
        Get object, with REST API login schema

        :return: schema object
        """
        schema = {
            'login': request.link(Login()),
            'schema': request.link(Database())
        }
        return schema


class Database(object):
    # SQLAlchemy to MODE types map
    __types = {
        '_Binary': 'binary',
        'LargeBinary': 'binary',
        'PickleType': 'binary',
        'Boolean': 'boolean',
        'Date': 'date',
        'DateTime': 'datetime',
        'Interval': 'datetime',
        'Integer': 'integer',
        'BigInteger': 'integer',
        'SmallInteger': 'integer',
        'Numeric': 'numeric',
        'Float': 'numeric',
        'Enum': 'selection',
        'String': 'string',
        'Text': 'text',
        'SchemaType': 'text',
        'Time': 'time',
        # sql types
        'BIGINT': 'integer',
        'BINARY': 'binary',
        'BLOB': 'binary',
        'BOOLEAN': 'boolean',
        'CHAR': 'string',
        'CLOB': 'binary',
        'DATE': 'date',
        'DATETIME': 'datetime',
        'DECIMAL': 'numeric',
        'FLOAT': 'numeric',
        'INT': 'integer',
        'INTEGER': 'integer',
        'NCHAR': 'string',
        'NVARCHAR': 'string',
        'NUMERIC': 'numeric',
        'REAL': 'numeric',
        'SMALLINT': 'integer',
        'TEXT': 'text',
        'TIME': 'time',
        'TIMESTAMP': 'datetime',
        'VARBINARY': 'binary',
        'VARCHAR': 'string',
        # postgresql types
        'BIT': 'binary',
        'BYTEA': 'binary',
        'DOUBLE_PRECISION': 'numeric',
    }

    def get_schema(self, request):
        """
        Get object, with REST API schema

        :return: schema object
        """
        schema = {
            # 'login': request.link(Login()),
            'logout': request.link(Logout()),
            'mode': request.link(Database(), name='mode'),
            'uni-grid-request': request.link(UniGridRequest()),
            'entities': {}
        }
        for c in orm_classes:
            t = Table(c)
            r = Record(c, 0)
            schema['entities'][c] = {
                'get': request.link(t),
                'add': request.link(t, name='add'),
                'record': request.link(r).replace('[0]', '[{' + '},{'.join(
                    [pk.name for pk in class_mapper(orm_classes[c]).primary_key]) + '}]')
            }
        return schema

    def get_mode(self):
        """
        Generate MODE for database

        :return: MODE object
        """
        mode = dict()
        for name in Base.metadata.tables:
            self.__process_table(mode, Base.metadata.tables[name])
        return mode

    @classmethod
    def to_mode_type(cls, type_):
        if type_ in cls.__types:
            return cls.__types[type_]
        print('Unsupported data type: ' + str(type_))
        return 'binary'
        # raise Exception('Unsupported data type: ' + str(type))

    @classmethod
    def __process_table(cls, mode, table):
        if table.name in mode:
            return

        obj = {
            'id': table.name,
            'attributes': {},
            'relations': []
        }
        mode[table.name] = obj
        for c in table.columns:
            obj['attributes'][c.name] = {
                'id': c.name,
                'type': cls.to_mode_type(type(c.type).__name__)
            }
        for r in table.foreign_keys:
            obj['relations'].append({
                'own_attr': r.parent.name,
                'rel_entity': r.column.table.name,
                'rel_attr': r.column.name,
                'type': 'many2one'
            })
            if table.name == r.column.table.name:
                child = obj
            else:
                cls.__process_table(mode, r.column.table)
                child = mode[r.column.table.name] if r.column.table.name in mode else None
            if child:
                child['relations'].append({
                    'own_attr': r.column.name,
                    'rel_entity': table.name,
                    'rel_attr': r.parent.name,
                    'type': 'one2one'
                })


class Table(object):
    def __init__(self, name):
        self.name = name

    def select(self):
        if self.name not in orm_classes:
            raise Exception('Table {name} doesn\'t exist'.format(name=self.name))
        cls = orm_classes[self.name]
        return Session().query(cls)

    def add(self, vals):
        """Add new row to table

        :param vals: initial values
        :param type: dict
        :return new row object
        """
        cls = orm_classes[self.name]
        obj = cls(**vals)
        session = Session()
        session.add(obj)
        session.flush()
        return obj


class Record(object):
    @classmethod
    def from_object(cls, obj):
        """Create Record instance from data object

        :param obj: data object
        :return: Record instance
        """
        table_name = obj.__class__.__name__
        ids = [getattr(obj, pk.name) for pk in class_mapper(obj.__class__).primary_key]
        return cls(table_name, ids, obj)

    def __init__(self, table_name, ids, obj=None):
        self.table_name = table_name
        if isinstance(ids, str):
            self.ids = loads(ids)
        else:
            self.ids = ids
        if not isinstance(self.ids, list):
            self.ids = [self.ids]
        self.obj = obj

    def get(self):
        if not self.obj:
            cls = orm_classes[self.table_name]
            self.obj = Session.query(cls).get(self.ids)
            if not self.obj:
                raise Exception('Record with id {id_} from table \'{table}\' doesn\'t exist'.format(id_=self.ids,
                                                                                                    table=self.table_name))
        return self.obj

    def patch(self, vals):
        """Replace values

        """
        obj = self.get()
        for key, val in vals.items():
            setattr(obj, key, val)
        Session.flush()
        return obj

    def replace(self, vals):
        """Reset all old values and set new

        """
        obj = self.get()
        pk = [pk.name for pk in class_mapper(obj.__class__).primary_key]
        for column in obj.__table__.columns.keys():
            if column not in pk:
                setattr(obj, column, None)
        return self.patch(vals)

    def remove(self):
        """Remove record from table

        """
        obj = self.get()
        Session.delete(obj)


class UniGridRequest(object):
    def query(self, request):
        request = request['unigrid']
        entity = request['entities']

        # array of requested fields
        fields = []
        # array of all query entities for simple field search
        entities = []
        # parse UniGridRequest. Get array of fields and array of entities
        for e in entity:
            self._process_entity_attrs(e, fields, entities)

        offset = request.get('offset', 0)
        query = Session().query(*[f['ref'] for f in fields if f['selected']])
        for e in entities:
            if 'join' in e:
                query = query.outerjoin((e['alias'], e['join']))
        # filtration
        where = self._process_where(request.get('where', {}), fields)
        if where is not None:
            query = query.filter(where)
        # sorting
        for order in self._process_order(request.get('order', []), fields):
            query = query.order_by(order)
        count = query.count()
        data = query.offset(offset).limit(request.get('limit', 100)).all()
        return {
            'cols': [f['alias'] for f in fields if f['selected']],
            'data': [[to_json_type(r[i]) for i in range(len(r))] for r in data],
            'size': {
                'total': count,
                'offset': offset,
                'frame': len(data)
            }
        }

    def query_summaries(self, request):
        request = request['unigrid']
        entity = request['entities']

        # array of requested fields
        fields = []
        # array of all query entities for simple field search
        entities = []
        # parse UniGridRequest. Get array of fields and array of entities
        for e in entity:
            self._process_entity_attrs(e, fields, entities)

        offset = request.get('offset', 0)
        query = Session().query(*[f['ref'] for f in fields if f['selected']])
        for e in entities:
            if 'join' in e:
                query = query.outerjoin((e['alias'], e['join']))
        # filtration
        where = self._process_where(request.get('where', {}), fields)
        if where is not None:
            query = query.filter(where)

        sum_fields = [(getattr(sql.func, s)(f['ref']), s, f['alias']) for f in fields if f['summaries'] for s in
                      f['summaries']]
        data = []
        if sum_fields:
            data = query.from_self(*[f[0] for f in sum_fields]).one()
        count = 1
        return {
            'cols': [str(f[1]) + '_' + str(f[2]) for f in sum_fields],
            'data': [to_json_type(data[i]) for i in range(len(data))],
            'size': {
                'total': count,
                'offset': offset,
                'frame': len(data)
            }
        }

    def query_export(self, request):
        request = request['unigrid']
        entity = request['entities']

        # array of requested fields
        fields = []
        # array of all query entities for simple field search
        entities = []
        # parse UniGridRequest. Get array of fields and array of entities
        for e in entity:
            self._process_entity_attrs(e, fields, entities)

        query = Session().query(*[f['ref'] for f in fields if f['selected']])
        for e in entities:
            if 'join' in e:
                query = query.outerjoin((e['alias'], e['join']))
        # filtration
        where = self._process_where(request.get('where', {}), fields)
        if where is not None:
            query = query.filter(where)
        # sorting
        for order in self._process_order(request.get('order', []), fields):
            query = query.order_by(order)

        class QueryIterable(object):
            def __init__(self, query):
                self.query = query

            def __iter__(self):
                return QueryIterator(self.query)

        class QueryIterator(object):
            offset = 0
            chunk_size = 10000

            def __init__(self, query):
                self.query = query

            def __iter__(self):
                return self

            def next(self):
                chunk = query.offset(self.offset).limit(self.chunk_size).all()
                self.offset += self.chunk_size
                if not chunk:
                    raise StopIteration
                return bytes('\n'.join([';'.join([str(f) for f in r]) for r in chunk]) + '\n', 'utf-8')

            __next__ = next  # py3 compat

        res = Response(content_type='text/csv', headerlist=[('Content-disposition', 'attachment;filename=export.csv')])
        res.app_iter = QueryIterable(query)
        return res

    @classmethod
    def _process_entity_attrs(cls, entity, fields, entities, parent_cls=None):
        child_cls = orm_classes[entity['id']]
        entity['alias'] = aliased(child_cls)
        if parent_cls:
            entity['join'] = getattr(parent_cls, entity['relation']['attr_parent'] + '_relationship')
        entities.append(entity)

        for attr in entity['attributes']:
            if 'entity' in attr:
                e = attr['entity']
                cls._process_entity_attrs(e, fields, entities, entity['alias'])
            else:
                field = {
                    'alias': attr['alias'] if 'alias' in attr else attr['id'],
                    'selected': attr['selected'],
                    'summaries': attr.get('summaries'),
                    'ref': getattr(entity['alias'], attr['id'])
                }
                fields.append(field)

    @classmethod
    def _process_order(cls, order, fields):
        return [getattr(cls._get_field_ref(o['alias'], fields), 'asc' if o.get('asc', True) else 'desc')() for o in
                order]

    @classmethod
    def _process_where(cls, where, fields):
        if 'cond' in where:
            cond = where['cond']
            type_ = cond['with']
            if type_ == 'AND':
                return and_(cls._process_where(clause, fields) for clause in cond['entries'])
            elif type_ == 'OR':
                return or_(cls._process_where(clause, fields) for clause in cond['entries'])
            elif type_ == 'NOT':
                return not_(cls._process_where(clause, fields) for clause in cond['entries'])
        elif 'func' in where:
            func_ = where['func']
            name = func_['name']
            args = [cls._process_where(arg, fields) for arg in func_['args']]
            if (name == 'ILIKE'):
                return args[0].ilike('%' + str(args[1]) + '%')
            if (name == 'NOT_ILIKE'):
                return args[0].notilike('%' + str(args[1]) + '%')
            if (name == 'IEQ'):
                return func.lower(args[0]).__eq__(func.lower(args[1]))
                # return args[0].ilike(args[1])
            if (name == 'NOT_IEQ'):
                return func.lower(args[0]).__ne__(func.lower(args[1]))
                # return args[0].notilike(args[1])
            if (name == 'IBETWEEN_INC'):
                return func.lower(args[0]).between(func.lower(args[1]), func.lower(args[2]))
            if (name == 'BETWEEN_INC'):
                return args[0].between(args[1], args[2])
            if (name == 'ISTARTS_WITH'):
                return args[0].startswith(args[1])
            if (name == 'NOT_ISTARTS_WITH'):
                return not_(args[0].startswith(args[1]))
            if (name == 'IENDS_WITH'):
                return args[0].endswith(args[1])
            if (name == 'NOT_IENDS_WITH'):
                return not_(args[0].endswith(args[1]))
            if (name == 'IN'):
                return args[0].in_(*args[1:])
            if (name == 'NOT_IN'):
                return args[0].notin_(*args[1:])
            if (name == 'EQ'):
                return args[0].__eq__(args[1])
            if (name == 'NOT_EQ'):
                return args[0].__ne__(args[1])
            if (name == 'LT'):
                return args[0].__lt__(args[1])
            if (name == 'LTE'):
                return args[0].__le__(args[1])
            if (name == 'GT'):
                return args[0].__gt__(args[1])
            if (name == 'GTE'):
                return args[0].__ge__(args[1])
            if (name == 'IS_NULL'):
                return args[0].is_(None)
            if (name == 'NOT_IS_NULL'):
                return args[0].isnot(None)
            return getattr(args[0], name)(*args[1:])
        elif 'alias' in where:
            return cls._get_field_ref(where['alias'], fields)
        elif 'value' in where:
            return where['value']
        return None

    @classmethod
    def _get_field_ref(cls, name, fields):
        for f in fields:
            if f['alias'] == name:
                return f['ref']
        raise Exception('Unknown field \'' + name + '\'')
