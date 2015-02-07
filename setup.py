from setuptools import setup, find_packages
from damvitool import version

setup(
    name='damvitool',
    version=version,
    packages=find_packages() + ['damvitool.static'],
    entry_points={
        'console_scripts': ['damvitool = damvitool.main:main']
    },
    install_requires=[
        'transaction',
        'morepath',
        'more.transaction',
        'zope.sqlalchemy >= 0.7.4',
        'sqlalchemy >= 0.9',
        'waitress',
        # 'psycopg2',
        'webassets',
        'static',
        # 'sphinx_rtd_theme'
    ],
    extras_require=dict(
        test=['pytest >= 2.5.2',
              'py >= 1.4.20',
              'pytest-cov',
              'pytest-remove-stale-bytecode',
              'WebTest >= 2.0.14'],
    ),
    include_package_data=True,
    url='http://damvitool.readthedocs.org',
    license='LGPL',
    author='alex-smirnov',
    author_email='smirnov.fl@yandex.ru',
    description='Sandman inspired database and schema agnostic automatic REST API creator and data viewer/analyser',
    long_description=open('README.rst').read(),
    classifiers=[
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 3',
        'Development Status :: 4 - Beta',
        'Natural Language :: English',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)',
        'Operating System :: OS Independent',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)
