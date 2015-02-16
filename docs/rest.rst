RESTful API
===========

* GET `/api` - return login schema
    Example::

        {
          "schema": "http://0.0.0.0:8080/api/database",
          "login": "http://0.0.0.0:8080/api/login"
        }

    where `login` - url for `POST` login request,
    `schema` - url to `GET` API schema

* POST `http://0.0.0.0:8080/api/login` - open new session
    Request data::

        {
          "username": "user1",
          "password": "password1"
        }

    Response data::

        {
          "username": "user1",
          "sessionId": "43bee700-b5ed-11e4-9596-a820662c96a1"
        }

    After login success, you must use HTTP Basic Authorization with `sessionId` instead of password.

* POST `/api/logout` - close current session

    Send empty request.

* GET `/api/database` - return api schema::

    {
      "logout": "http://0.0.0.0:8080/api/logout",
      "mode": "http://0.0.0.0:8080/api/database/mode",
      "uni-grid-request": "http://0.0.0.0:8080/api/database/uni-grid-request",
      "entities": {
        "PlaylistTrack": {
          "get": "http://0.0.0.0:8080/api/database/tables/PlaylistTrack",
          "add": "http://0.0.0.0:8080/api/database/tables/PlaylistTrack/add",
          "record": "http://0.0.0.0:8080/api/database/tables/PlaylistTrack/recs/[{PlaylistId},{TrackId}]"
        },
        "Invoice": {
          "get": "http://0.0.0.0:8080/api/database/tables/Invoice",
          "add": "http://0.0.0.0:8080/api/database/tables/Invoice/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Invoice/recs/[{InvoiceId}]"
        },
        "Employee": {
          "get": "http://0.0.0.0:8080/api/database/tables/Employee",
          "add": "http://0.0.0.0:8080/api/database/tables/Employee/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Employee/recs/[{EmployeeId}]"
        },
        "Artist": {
          "get": "http://0.0.0.0:8080/api/database/tables/Artist",
          "add": "http://0.0.0.0:8080/api/database/tables/Artist/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Artist/recs/[{ArtistId}]"
        },
        "MediaType": {
          "get": "http://0.0.0.0:8080/api/database/tables/MediaType",
          "add": "http://0.0.0.0:8080/api/database/tables/MediaType/add",
          "record": "http://0.0.0.0:8080/api/database/tables/MediaType/recs/[{MediaTypeId}]"
        },
        "Customer": {
          "get": "http://0.0.0.0:8080/api/database/tables/Customer",
          "add": "http://0.0.0.0:8080/api/database/tables/Customer/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Customer/recs/[{CustomerId}]"
        },
        "Track": {
          "get": "http://0.0.0.0:8080/api/database/tables/Track",
          "add": "http://0.0.0.0:8080/api/database/tables/Track/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Track/recs/[{TrackId}]"
        },
        "Album": {
          "get": "http://0.0.0.0:8080/api/database/tables/Album",
          "add": "http://0.0.0.0:8080/api/database/tables/Album/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Album/recs/[{AlbumId}]"
        },
        "InvoiceLine": {
          "get": "http://0.0.0.0:8080/api/database/tables/InvoiceLine",
          "add": "http://0.0.0.0:8080/api/database/tables/InvoiceLine/add",
          "record": "http://0.0.0.0:8080/api/database/tables/InvoiceLine/recs/[{InvoiceLineId}]"
        },
        "Genre": {
          "get": "http://0.0.0.0:8080/api/database/tables/Genre",
          "add": "http://0.0.0.0:8080/api/database/tables/Genre/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Genre/recs/[{GenreId}]"
        },
        "Playlist": {
          "get": "http://0.0.0.0:8080/api/database/tables/Playlist",
          "add": "http://0.0.0.0:8080/api/database/tables/Playlist/add",
          "record": "http://0.0.0.0:8080/api/database/tables/Playlist/recs/[{PlaylistId}]"
        }
      }
    }

* GET `/api/database/tables/{entity_name}` - return all records of entity type::

    {
      "add": "http://0.0.0.0:8080/api/database/tables/Album/add",
      "data": [
        {
          "__links__": {"ForeignKey('Artist.ArtistId')": "http://0.0.0.0:8080/api/database/tables/Artist/recs/[1]"},
          "__url__": "http://0.0.0.0:8080/api/database/tables/Album/recs/[1]",
          "ArtistId": 1,
          "Title": "For Those About To Rock We Salute You",
          "AlbumId": 1
        },
        {
          "__links__": {"ForeignKey('Artist.ArtistId')": "http://0.0.0.0:8080/api/database/tables/Artist/recs/[2]"},
          "__url__": "http://0.0.0.0:8080/api/database/tables/Album/recs/[2]",
          "ArtistId": 2,
          "Title": "Balls to the Wall",
          "AlbumId": 2
        },
        ...
      ]
    }


* GET `http://0.0.0.0:8080/api/database/tables/{EntityName}/recs/{EntityId}` - return entity::

    {
      "__url__": "http://0.0.0.0:8080/api/database/tables/Artist/recs/[1]",
      "__links__": {},
      "ArtistId": 1,
      "Name": "AC/DC"
    }

* GET `http://0.0.0.0:8080/api/database/mode` - return Map Of the Domain Entities (MODE)::

    {
      "entity01": {
        "id": "entity01", // (required) ID of the entity
        "name": "Entity 01", // (optional) Human readable name of the entity (i18n translatable?).
        "attributes": { /* set of attributes of the entity */
          "id": {
            "id": "id", // (required) Name of the attribute (column name)
            "name": "ID", // (optional) Human readable name of the attribute (i18n translatable?).
            "type": "integer" // (required) Type of the entity ([boolean, string, text, integer, numeric, datetime, ...])
          },
          "write_uid": {
            "id": "write_uid", // (required) Name of the attribute (column name)
            "name": "Write User ID", // (optional) Human readable name of the attribute (i18n translatable?).
            "type": "integer" // (required) Type of the entity ([boolean, string, text, integer, numeric, datetime, ...])
          },
          ...
        },
        "relations": [ /* list of relations of the entity */
          {
            "own_attr": "write_uid", // (required) Code of the attribute of the 'entity01' that is used in this relation.
            "rel_entity": "user", // (required) Code of the other entity from this relation.
            "rel_attr": "id", // (required) Code of the attribute of the 'other entity' from this relation.
            "type": "many2one" // (required) Type of the relation ([many2one, one2many])
          },
          ...
        ]
      },
      .
      .
      .
      "entityZZ": {
        ...
      }
    }

* POST `http://0.0.0.0:8080/api/database/uni-grid-request` - query UniGridRequest.
    POST data::

        {
          "entities": [
            { /* root entity with related entities and theirs attributes */
              "id":         "entity01", /* (required) entity name (table or view name) */
              "alias":      "entity01", /* (required) alias to use in the other rules (filtering, ordering, etc.) */
              "relation":   { /* (required) relation between parent entity and the current entity, empty for the root entity */ }
              "attributes": [ /* (optional) list of the current entitie's attributes and related entities with their attributes */
                { /* attribute or related entity */
                  "id":       "id",           /* (required) ID of the entitie's attributes */
                  "alias":    "entity01_id",  /* (required) alias to use this attributes in the other rules (filtering, otrdering, etc.) */
                  "selected": "true",         /* (required) 'true' - this attribute will be included into the result set; 'false' - this attribute will be used in the filter/grouping rules only */
                  "summaries": ["sum", "avg"] /* array of the summary types for attribute */
                },
                ...
              ]
            },
            ...
          ],
          "where":    { /* filtering */ },
          "order":    [ /* sorting */ ],
          "offset":   0, /* pagination */
          "limit":    100 /* pagination */
        };

    Example request::

        {
          "unigrid": {
            "entities": [
              {
                "attributes": [
                  {
                    "entity": {
                      "attributes": [
                        {
                          "id": "Name",
                          "alias": "Album_1_Artist_ArtistId_Name",
                          "selected": true
                        }
                      ],
                      "id": "Artist",
                      "relation": {"attr_parent": "ArtistId"}
                    }
                  },
                  {
                    "id": "Title",
                    "alias": "Album_1_Title",
                    "selected": true
                  }
                ],
                "id": "Album",
                "relation": null
              }
            ],
            "where": {
              "cond": {
                "with": "AND",
                "entries": [
                  {
                    "func": {
                      "name": "ILIKE",
                      "args": [
                        {"alias": "Album_1_Title"},
                        {"value": "rest"}
                      ]
                    }
                  }
                ]
              }
            },
            "order": [],
            "offset": 0,
            "limit": 75
          }
        }


    Example result::

        {
          "data": [
            [
              "Accept",
              "Restless and Wild"
            ]
          ],
          "cols": [
            "Album_1_Artist_ArtistId_Name",
            "Album_1_Title"
          ],
          "size": {
            "offset": 0,
            "total": 1,
            "frame": 1
          }
        }

