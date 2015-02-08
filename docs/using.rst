===============
Using damvitool
===============

Run damvitool with sample database
----------------------------------

To run damvitool execute the following command::

    damvitool --database sqlite:///damvitool/data/Chinook_Sqlite.sqlite

Where *sqlite:///damvitool/data/Chinook_Sqlite.sqlite* is database URL in SQLAlchemy format (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#database-urls).

damvitool starts web server with RESTful API for data access and client application that utilizes that API accessible from any browser.

If you start damvitool without any parameters it will connect by default to the demo database Chinook_Sqlite, which is distributed together with damvitool.

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
