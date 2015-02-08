=========
damvitool
=========

Resources
=========
*. `Documentation <http://damvitool.readthedocs.org>`_
*. `Bug tracker <http://github.com/praxigento/damvitool/issues>`_
*. `Code <http://github.com/praxigento/damvitool>`_

Quick start
===========

Installation
------------
Use pip to install damvitool ::

    $ pip install damvitool

Run damvitool with sample database (Chinook Database for SQLite)
----------------------------------------------------------------

Run damvitool from command line::

    $ damvitool

Open frontend
-------------
Open damvitool frontend in your browser. By default you can open url ``http://localhost:8080``

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
