===============
Using damvitool
===============

Run damvitool with sample database
----------------------------------

Для запуска damvitool достаточно выполнить команду::

    damvitool --database sqlite:///damvitool/data/Chinook_Sqlite.sqlite

где sqlite:///damvitool/data/Chinook_Sqlite.sqlite - строка доступа к базе данных (Database Urls) в формате SQLAlchemy (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#database-urls).

damvitool запускает web-сервер с RESTful API для доступа к данным и с клиентским приложением, использующим это API, которое можно открыть в любом браузере.

В случае запуска damvitool без параметров, программа подключится к демонстрационной базе Chinook_Sqlite, распространяемой с пакетом.

Supported databases
-------------------

damvitool поддерживает те же типы СУБД, что и SQLAlchemy (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#supported-databases):

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
