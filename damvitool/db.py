from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy.orm import relationship, backref, scoped_session, sessionmaker
from zope.sqlalchemy import register

__author__ = 'alex'

Base = declarative_base()
Session = scoped_session(sessionmaker())
register(Session)
orm_classes = dict()


def generate_orm_classes(db_conn_str):
    seen_classes = set()
    engine = create_engine(db_conn_str, echo=False)
    print('Connect to db: ' + db_conn_str)
    Base.metadata.reflect(bind=engine)
    print('Found ' + str(len(Base.metadata.tables)) + ' tables')
    for name, table in Base.metadata.tables.items():
        if not name in seen_classes:
            seen_classes.add(name)
            tmpl = {'__tablename__': name, '__related_tables__': set()}
            if not table.primary_key:
                tmpl['__mapper_args__'] = {'primary_key': [c for c in table.columns]}
            cls = type(str(name), (Base, ), tmpl)
            orm_classes[name] = cls
    inspector = Inspector.from_engine(engine)
    for cls in set(orm_classes.values()):
        for foreign_key in inspector.get_foreign_keys(cls.__tablename__):
            if foreign_key['referred_table'] in orm_classes:
                other = orm_classes[foreign_key['referred_table']]
                constrained_column = foreign_key['constrained_columns']
                if other not in cls.__related_tables__ and cls not in (
                        other.__related_tables__) and other != cls:
                    cls.__related_tables__.add(other)
                # Add a SQLAlchemy relationship as an attribute
                # on the class
                setattr(cls, '_'.join(foreign_key['constrained_columns']) + '_relationship', relationship(
                    other.__name__, #backref=backref(cls.__name__.lower()),
                    foreign_keys=str(cls.__name__) + '.' + ''.join(constrained_column)))

    Session.configure(bind=engine)
