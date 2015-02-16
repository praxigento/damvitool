===============
Using damvitool
===============

Run damvitool with sample database
----------------------------------
To run damvitool execute the following command::

    $ damvitool

When you run damvitool from command line without parameters it connects by default to the demo Chinook Database for SQLite.

To connect to your legacy database run damvitool with your database URL as parameter, like so::

$ damvitool --database sqlite:///damvitool/data/Chinook_Sqlite.sqlite

where *sqlite:///damvitool/data/Chinook_Sqlite.sqlite* is database URL in SQLAlchemy format (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#database-urls).

Admin panel access
------------------
Default admin panel URL is ``http://localhost:8080``

Supported databases
-------------------

damvitool supports the same RDBMSs as SQLAlchemy (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#supported-databases):

* MySQL (MariaDB)
* PostgreSQL
* SQLite
* Oracle
* Microsoft SQL Server
* Firebird
* Drizzle
* Sybase
* IBM DB2
* SAP Sybase SQL Anywhere
* MonetDB
