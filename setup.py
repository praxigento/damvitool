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
        'static'
    ],
    # tests_require=[
    # 'webtest',
    #     'pytest'
    # ],
    extras_require=dict(
        test=['pytest >= 2.5.2',
              'py >= 1.4.20',
              'pytest-cov',
              'pytest-remove-stale-bytecode',
              'WebTest >= 2.0.14'],
    ),
    # package_data={
    # 'damvitool': ['static/*']
    # },
    include_package_data=True,
    url='',
    license='LGPL',
    author='alex-smirnov',
    author_email='smirnov.fl@yandex.ru',
    description='Sandman inspired database and schema agnostic automatic REST API creator and data viewer/analyser'
)
