=========
damvitool
=========

.. image:: http://img.shields.io/:license-lgpl v3.0-green.svg?style=flat-square
    :target: https://www.gnu.org/licenses/lgpl-3.0.txt
    
.. image:: https://img.shields.io/pypi/v/damvitool.svg?style=flat-square
    :target: http://badge.fury.io/py/damvitool
    :alt: Latest version

Introduction
============

As stated above this project was inspired by Sandman by Jeff Knupp. At the same time damvitool improves on the original in a few important areas:

* Support for compound queries (both for REST API and UI)
* Extremely flexible and powerful UI (query builder wizard) thanks to SmartClient library by Isomorphic
* Columns summaries support
* Unlimited resulting (sorted&filtered) grid export to CSV

Resources
=========
* `Documentation <http://damvitool.readthedocs.org>`_
* `Bug tracker <http://github.com/praxigento/damvitool/issues>`_
* `Code <http://github.com/praxigento/damvitool>`_
* `Run/edit damvitool in cloud IDE <https://codenvy.com/f?id=nbmasoip8dnvkc4d>`_

Frameworks and libraries used
=============================

* `SQLAlchemy <https://github.com/zzzeek/sqlalchemy>`_ v0.9.8+
* `Morepath <https://github.com/morepath/morepath>`_ v0.9+
* `AngularJS <http://www.angularjs.org>`_ v1.2.1+
* `Isomorphic SmartClient <http://www.smartclient.com/product/smartclient.jsp>`_ v9.1+
* `ng_isc <https://github.com/praxigento/ng-isc>`_ v0.2+

Versioning
==========

`Semantic Versioning 2.0.0 <http://semver.org>`_

Quick start
===========

Installation
------------
Use pip to install damvitool::

    $ pip install damvitool

Run damvitool from command line::

    $ damvitool
    
When you run damvitool from command line without parameters it connects by default to the demo Chinook Database for SQLite.

To connect to your legacy database run damvitool with your database URL as parameter, like so::

$ damvitool --database sqlite:///damvitool/data/Chinook_Sqlite.sqlite

where *sqlite:///damvitool/data/Chinook_Sqlite.sqlite* is database URL in SQLAlchemy format (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#database-urls).

Admin panel access
------------------
Default admin panel URL is ``http://localhost:8080``

Build new database request
--------------------------
1. Click ``Wizard`` button of the left side menu.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic1.png

2. Login with the following credentials: user1/password1 .

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic2.png

3. Choose root entity for your data query. If database doesn't have relations between the tables needed for your query, you can add other root entities.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic3.png

4. Choose relevant entities fields.
5. Set filter criteria.
6. View results.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic4.png
