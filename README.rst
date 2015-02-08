=========
damvitool
=========

.. image:: http://img.shields.io/:license-lgplv3.0-blue.svg?style=flat-square
    :target: https://www.gnu.org/licenses/lgpl-3.0.txt
    
.. image:: https://badge.fury.io/py/damvitool.png
    :target: http://badge.fury.io/py/damvitool
    :alt: Latest version

Resources
=========
`Documentation <http://damvitool.readthedocs.org>`__

`Bug tracker <http://github.com/praxigento/damvitool/issues>`__

`Code <http://github.com/praxigento/damvitool>`__

Requirements
============

Isomorphic SmartClient (http://www.smartclient.com/product/smartclient.jsp) v9.1+

AngularJS (http://www.angularjs.org) v1.2.1+

Versioning
==========

Semantic Versioning 2.0.0 (http://semver.org)

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

damvitool --database sqlite:///damvitool/data/Chinook_Sqlite.sqlite

where *sqlite:///damvitool/data/Chinook_Sqlite.sqlite* is database URL in SQLAlchemy format (http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#database-urls).

damvitool admin panel access
----------------------------
Default admin panel URL is ``http://localhost:8080``

Construct new request to database
---------------------------------
1. Click ``Wizard`` button of the left side menu.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic1.png

2. Login.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic2.png

3. Choose root entity for your data query. If database doesn't have relations between the tables needed for your query, you can add other root entities.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic3.png

4. Choose relevant entities fields.
5. Set filter criteria.
6. View results.

.. image:: https://raw.githubusercontent.com/praxigento/damvitool/master/docs/pic4.png
