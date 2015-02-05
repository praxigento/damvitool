====================
Developing damvitool
====================

Install damvitool for development
---------------------------------
Clone damvitool from github and go to damvitool directory::

    $ git clone https://github.com/praxigento/damvitool.git
    $ cd damvitool

Now we need to run bootstrap.py to set up buildout::

    $ python bootstrap.py

Run buildout, which downloads and installs various dependencies and tools.

Running the tests
-----------------
You can run the backend tests using py.test. Buildout has installed it for you in the bin subdirectory of your project::

    $ bin/py.test damvitool

To run frontend tests, you must init node.js environment::

    $ npm install

After that, run tests::

    $ npm test

