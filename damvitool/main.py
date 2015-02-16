__author__ = 'alex'

import argparse
import morepath
import waitress
from damvitool.static_app import StaticApp
from damvitool.db_app import DamvitoolApp, dbApp
from damvitool.db import generate_orm_classes
from damvitool.users import Users
from damvitool import version
import logging
import os
from . import path, view, users


staticApp = StaticApp()


@StaticApp.mount(app=DamvitoolApp, path='api')
def mount_app():
    return dbApp


def parse_commandline():
    def_con_str = 'sqlite:///' + os.path.realpath(
        os.path.join(os.path.dirname(__file__), 'data', 'Chinook_Sqlite.sqlite'))

    parser = argparse.ArgumentParser(prog='damvitool')

    parser.add_argument("--host", dest="host", default="0.0.0.0",
                        help="specify RESTful API server name")
    parser.add_argument("-p", "--port", dest="port", default=8080,
                        help="specify RESTful API server port")

    parser.add_argument('--version', action='version',
                        version='%(prog)s ' + version)

    parser.add_argument("-d", "--database", dest="db_conn_string", default=def_con_str,
                        help="specify the database connect string")

    parser.add_argument("-u", "--users", dest="users_file", default='etc/users', type=argparse.FileType('r'),
                        help="specify the file with users credentials")

    parser.add_argument("-n", "--no-auth", action="store_true", help="specify the 'no auth' mode")

    # parser.add_argument("--pidfile", dest="pidfile",
    # help="file where the server pid will be stored")
    # parser.add_argument("--logfile", dest="logfile",
    # help="file where the server log will be stored")

    # parser.epilog = ('The first time a database is initialized with "-i" admin'
    # ' password is read from file defined by TRYTONPASSFILE '
    # 'environment variable or interactively ask user. '
    # 'The config file can be specified in the TRYTOND_CONFIG '
    # 'environment variable.')

    options = parser.parse_args()
    return options


def main():
    """Start REST ARI server

    """
    logging.basicConfig(level=logging.DEBUG)

    options = parse_commandline()

    # init orm
    generate_orm_classes(options.db_conn_string)

    # load users info
    if options.no_auth:
        Users.no_auth = True
    else:
        Users.load(options.users_file)

    c = morepath.setup()
    c.scan(ignore=['.tests'])
    c.commit()

    # morepath.autosetup()
    logger = logging.getLogger('waitress')
    logger.setLevel(logging.INFO)
    waitress.serve(staticApp, host=options.host, port=options.port)
    # waitress.serve(dbApp, host=options.host, port=options.port)
