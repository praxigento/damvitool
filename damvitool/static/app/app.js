/*global angular */

var damvitoolApp = angular.module('damvitool', ['ngRoute', 'ngResource', 'ng-isc', 'prxgtAuth']);

damvitoolApp.factory('Mode', ['$resource', function ($resource) {
    'use strict';

    return $resource('api/database/mode', {}, {query: {method: 'GET'}, isArray: true});
}]);

damvitoolApp.factory('UniGridRequest', ['$resource', function ($resource) {
    'use strict';

    return $resource('api/database/uni-grid-request', {}, {query: {method: 'POST'}, isArray: true});
}]);

damvitoolApp.factory('UniGridSummariesRequest', ['$resource', function ($resource) {
    'use strict';

    return $resource('api/database/uni-grid-request/summaries', {}, {query: {method: 'POST'}, isArray: true});
}]);

damvitoolApp.factory('UniGridExportRequest', ['$resource', function ($resource) {
    'use strict';

    return $resource('api/database/uni-grid-request/export', {}, {query: {method: 'POST'}, isArray: false});
}]);

damvitoolApp.config(['$routeProvider', function ($routeProvider) {
    'use strict';

    $routeProvider.
        when('/', {
            templateUrl: 'welcome.html',
            data: {
                requireLogin: false
            }
        }).
        when('/wizard', {
            templateUrl: 'wizard.html',
            controller: 'WizardCtrl',
            data: {
                requireLogin: true
            }
        }).
        when('/help', {
            templateUrl: 'help.html',
            data: {
                requireLogin: false
            }
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

damvitoolApp.controller('MenuCtrl', function ($scope, $rootScope, $location) {
    'use strict';

    $scope.toWelcome = function () {
        $location.path('/');
    };

    $scope.toWizard = function () {
        $location.path('/wizard');
    };

    $scope.toHelp = function () {
        $location.path('/help');
    };
});

damvitoolApp.controller('WizardCtrl', function ($scope, $q, Mode, UniGridRequest, UniGridSummariesRequest, $http) {
    'use strict';

    function getEntities(mode) {
        var entities = [];
        angular.forEach(mode, function (e, k) {
            if (k.indexOf('$') !== 0) {
                entities.push({name: e.id});
            }
        });
        return entities;
    }

    function getUniqueAlias(alias) {
        var fields = $scope.fieldsTreeCtrl.getSelectedRecords();
        var a = alias;
        var count = 0;
        var unique = false;
        while (!unique) {
            unique = true;
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].alias == a) {
                    count++;
                    a = alias + '_' + count;
                    unique = false;
                    break;
                }
            }
        }
        return a;
    }


    // Entities

    $scope.entitiesWnd = null;

    $scope.entityGridData = [];
    $scope.mode = Mode.get(function () {
        $scope.entityGridData = getEntities($scope.mode);
    });

    $scope.entityGridFields = [
        {name: 'name'}
    ];

    $scope.onEntityGridDataFetch = function () {
        return $q.when($scope.mode.$promise).then(function () {
            return {data: $scope.entityGridData};
        });
    };

    $scope.onDblClickEntitiesGrid = function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
        var e = $scope.mode[record.name];
        $scope.fieldsTreeRoots.push(e);
        //$scope.fieldsTreeCtrl.invalidateCache();
        $scope.fieldsTreeCtrl.data.add({
            id: [e.id + ',' + $scope.fieldsTreeRoots.length],
            type: 'entity',
            name: e.id + ' entity',
            entity: e,
            isFolder: true,
            canSelect: false,
            _canEdit: false
        }, $scope.fieldsTreeCtrl.data.root);
        $scope.entitiesWnd.hide();
    };


    // Fields

    $scope.fieldsTreeCtrl = null;

    $scope.fieldsTreeFields = [
        {name: 'id', hidden: true, primaryKey: true},
        {name: 'name', title: 'Field name', frozen: true, canEdit: false},
        {name: 'alias', title: 'Alias', hidden: true},
        {name: 'title_', title: 'Title'},
        {name: 'select', title: 'Visible', type: 'boolean'},
        {
            name: 'summaries', title: 'Summary', multiple: true, editorType: 'select', multipleAppearance: 'picklist',
            getEditorValueMap: function (values, field, grid) {
                if (values.field.type === 'integer' || values.field.type === 'numeric') {
                    return ['sum', 'min', 'max', 'avg'];
                } else if (values.field.type === 'date' || values.field.type === 'time' || values.field.type === 'datetime') {
                    return ['min', 'max'];
                } else {
                    return [];
                }
            }, width: 100
        },
        {name: 'type', hidden: true}
    ];

    // array of root entities of uni-grid-request
    $scope.fieldsTreeRoots = [];

    $scope.onFieldsTreeDataFetch = function (req) {
        var items = [];
        if (req.data.parentId) {
            var e;
            if (angular.isArray(req.data.parentId)) {
                e = $scope.mode[req.data.parentId[req.data.parentId.length - 1].split(',')[0]];
            } else {
                e = $scope.mode[req.data.parentId];
            }
            if (e) {
                angular.forEach(e.relations, function (r, k) {
                    if (r.type === 'many2one') {
                        items.push({
                            id: [].concat(req.data.parentId, [].concat(r.rel_entity, r.own_attr).join(',')),
                            type: 'relation',
                            name: r.rel_entity + '(' + [].concat(r.own_attr).join(', ') + ') relation',
                            parentId: req.data.parentId,
                            entity: e,
                            relation: r,
                            isFolder: true,
                            canSelect: false,
                            _canEdit: false
                        });
                    }
                });
                angular.forEach(e.attributes, function (f, k) {
                    items.push({
                        id: [].concat(req.data.parentId, f.id),
                        type: 'field',
                        name: f.id + ' field (' + f.type + ')',
                        entity: e,
                        field: f,
                        parentId: req.data.parentId,
                        isFolder: false //(getRelation(e, f.id) != null)
                    });
                });
                items.sort(function (l, r) {
                    if (l.type == 'relation' && r.type == 'field') {
                        return -1;
                    } else if (l.type == 'field' && r.type == 'relation') {
                        return 1;
                    }
                    return l.name.localeCompare(r.name);
                });
            }
        } else {
            var count = 1;
            angular.forEach($scope.fieldsTreeRoots, function (e) {
                items.push({
                    id: [e.id + ',' + count++],
                    type: 'entity',
                    name: e.id + ' entity',
                    entity: e,
                    isFolder: true,
                    canSelect: false,
                    _canEdit: false
                });
            });
            //items.push({
            //        type: 'addBtn',
            //        name: 'Add entity',
            //        isFolder: false,
            //        canSelect: false,
            //        _canEdit: false
            //    });
        }
        return {data: items};
    };

    $scope.onFieldsTreeSelect = function (record, state) {
        if (state) {
            if (!record.alias) {
                if (record.old_alias) {
                    record.alias = getUniqueAlias(record.old_alias);
                } else {
                    record.alias = getUniqueAlias(record.id.join('_').replace(/[\.\,]/g, '_'));
                }
            }
            if (!record.title_) {
                record.title_ = record.id[record.id.length - 1];
            }
            if (!record.select) {
                record.select = true;
            }
        } else {
            record.old_alias = record.alias;
            delete record.alias;
        }
        $scope.fieldsTreeCtrl.markForRedraw();
    };

    $scope.onFieldsTreeSelectUpdate = function () {
        var types = {
            binary: 'binary',
            boolean: 'boolean',
            date: 'date',
            time: 'time',
            datetime: 'datetime',
            integer: 'integer',
            numeric: 'float',
            selection: 'enum',
            string: 'text',
            text: 'text'
        };

        var fields = $scope.fieldsTreeCtrl.getSelectedRecords();
        var dsFields = [];
        var dsNewFields = [];
        angular.forEach($scope.resultDS.fields, function (f) {
            f.finded = false;
            dsFields.push(f);
        });
        angular.forEach(fields, function (f) {
            var finded = false;
            for (var i = 0; i < dsFields.length; i++) {
                if (dsFields[i].id == f.id) {
                    dsFields[i].finded = finded = true;
                    dsFields[i].alias = f.alias;
                    dsFields[i].title = f.title_;
                    dsFields[i].hidden = !f.select;
                    dsFields[i].showGridSummary = (f.sumaries && f.sumaries.length > 0);
                    dsFields[i].summaryFunction = f.sumaries;
                    break;
                }
            }
            if (!finded) {
                dsNewFields.push({
                    id: f.id,
                    name: f.alias,
                    title: f.title_,
                    type: types[f.field.type],
                    hidden: !f.select,
                    showGridSummary: (f.sumaries && f.sumaries.length > 0),
                    summaryFunction: f.sumaries
                });
            }
        });
        for (var i = dsFields.length - 1; i >= 0; i--) {
            if (dsFields[i].finded != true) {
                dsFields.splice(i, 1);
            }
        }
        dsFields = [].concat(dsFields, dsNewFields);

        $scope.resultDS = isc.DataSource.create({
            ugr: getUniGridRequest(),
            fields: dsFields,
            dataProtocol: 'clientCustom',
            transformRequest: function (dsRequest) {
                if (dsRequest.operationType === "fetch") {
                    var res = [];
                    var ugr = angular.copy($scope.resultDS.ugr);

                    if (ugr.entities.length == 0) {
                        $scope.resultDS.processResponse(dsRequest.requestId, {
                            data: res,
                            totalRows: 0,
                            startRow: 0,
                            endRow: 0
                        });
                        return;
                    }

                    ugr.where = convertCriteriaToWhere(dsRequest.data);
                    ugr.order = [];
                    angular.forEach(dsRequest.sortBy, function (s) {
                        ugr.order.push({alias: s.replace('-', ''), asc: s.substring(0, 1) != '-'});
                    });
                    ugr.offset = dsRequest.startRow;
                    ugr.limit = dsRequest.endRow - dsRequest.startRow;
                    var data = UniGridRequest.query({unigrid: ugr}, function () {
                        angular.forEach(data.data, function (r) {
                            var rec = {};
                            for (var i = 0; i < data.cols.length; i++) {
                                rec[data.cols[i]] = r[i];
                            }
                            res.push(rec);
                        });
                        $scope.resultDS.processResponse(dsRequest.requestId, {
                            data: res,
                            totalRows: data.size.total,
                            startRow: data.size.offset,
                            endRow: data.size.offset + data.size.frame
                        });

                        $scope.resultCtrl.setFieldTitle(0, $scope.resultCtrl.getDisplayValue($scope.resultCtrl.getRowNumberField().id, $scope.resultCtrl.getTotalRows()));
                        $scope.resultCtrl.autoFitFields([$scope.resultCtrl.getRowNumberField()]);
                    }, function (err) {
                        $scope.resultDS.processResponse(dsRequest.requestId, {
                            status: isc.RPCResponse.STATUS_FAILURE,
                            data: err.data.error
                        });

                        $scope.resultCtrl.setFieldTitle(0, '');
                    });
                }
            }
        });

        $scope.resultSummariesDS = isc.DataSource.create({
            ugr: getUniGridRequest(),
            fields: dsFields,
            dataProtocol: 'clientCustom',
            transformRequest: function (dsRequest) {
                if (dsRequest.operationType === "fetch") {
                    var ugr = angular.copy($scope.resultDS.ugr);

                    if (ugr.entities.length == 0) {
                        $scope.resultSummariesDS.processResponse(dsRequest.requestId, {
                            data: [],
                            totalRows: 0,
                            startRow: 0,
                            endRow: 0
                        });
                        return;
                    }

                    ugr.where = convertCriteriaToWhere(dsRequest.data);
                    var data = UniGridSummariesRequest.query({unigrid: ugr}, function () {
                        var res = [];
                        for (var i = 0; i < data.data.length; i++) {
                            var indx = data.cols[i].indexOf('_');
                            var func = data.cols[i].substr(0, indx);
                            var col = data.cols[i].substr(indx + 1);
                            var added = false;
                            for (var j = 0; j < res.length; j++) {
                                if (res[j][col] === undefined) {
                                    res[j][col] = func + ': ' + $scope.resultCtrl.getDisplayValue(col, data.data[i]);
                                    added = true;
                                    break;
                                }
                            }
                            if (!added) {
                                var rec = {};
                                rec[col] = func + ': ' + $scope.resultCtrl.getDisplayValue(col, data.data[i]);
                                res.push(rec);
                            }
                        }
                        $scope.resultSummariesDS.processResponse(dsRequest.requestId, {
                            data: res,
                            totalRows: res.length,
                            startRow: 0,
                            endRow: res.length
                        });
                    }, function (err) {
                        $scope.resultSummariesDS.processResponse(dsRequest.requestId, {
                            status: isc.RPCResponse.STATUS_FAILURE,
                            data: err.data.error
                        });
                    });
                }
            }
        });

        // save state of columns formatting
        var fieldsState = $scope.resultCtrl.getFieldState(true);
        // add info about new columns to state
        angular.forEach(dsNewFields, function (f) {
            fieldsState.push({name: f.name, width: null});
        });
        // set new summaries datasource
        $scope.resultCtrl.summaryRowDataSource = $scope.resultSummariesDS;
        // set new data source
        $scope.resultCtrl.setDataSource($scope.resultDS);
        // restore columns formatting state
        $scope.resultCtrl.setFieldState(fieldsState);
        // update summaries
        $scope.resultCtrl.recalculateGridSummary();


        // create another datasource for filter builder, for operate with hidden fields
        angular.forEach(dsFields, function (f) {
            f.hidden = false;
        });
        var filterDS = isc.DataSource.create({
            dataProtocol: 'clientCustom',
            fields: dsFields
        });
        var criteria = $scope.filterBuilderCtrl.getCriteria(true);
        $scope.filterBuilderCtrl.setDataSource(filterDS);
        $scope.filterBuilderCtrl.setCriteria(criteria);
        // вызывается из обработчика изменеия критерия
        //updateResult();
    };

    $scope.onFieldsTreeRowEditorExit = function (editCompletionEvent, record, newValues, rowNum) {
        var upd = false;
        angular.forEach(newValues, function (v, k) {
            if (k == 'alias') {
                var newVal = getUniqueAlias(v);
                if (record[k] != newVal) {
                    record[k] = newVal;
                    upd = true;
                }
            } else {
                if (record[k] != v) {
                    record[k] = v;
                    upd = true;
                }
            }
        });
        if (upd) {
            $scope.onFieldsTreeSelectUpdate();
        }
    };

    $scope.fieldsTreeContextMenu = isc.Menu.create({
        autoDraw: false,
        width: 150,
        data: [
            {
                title: 'Add entity...',
                click: function () {
                    $scope.entitiesWnd.show();
                }
            }
        ]
    });

    var fieldsTreeMenuRecord = null;
    var fieldsTreeRowContextMenu = isc.Menu.create({
        autoDraw: false,
        width: 150,
        data: [
            {
                title: 'Remove entity...',
                click: function () {
                    $scope.fieldsTreeCtrl.data.remove(fieldsTreeMenuRecord);
                    $scope.onFieldsTreeSelectUpdate();
                }
            }
        ]
    });
    $scope.onFieldsTreeRowContextClick = function (record, rowNum, colNum) {
        if (record.type === 'entity') {
            fieldsTreeMenuRecord = record;
            fieldsTreeRowContextMenu.showContextMenu();
            return false;
        }
        return true;
    };


    // filter

    $scope.filterBuilderCtrl = null;

    $scope.onFilterChanged = function () {
        updateResult();
    };


    // result

    $scope.resultDS = isc.DataSource.create({dataProtocol: "clientCustom"});
    $scope.resultSummariesDS = isc.DataSource.create({dataProtocol: "clientCustom"});

    $scope.onSortChanged = function () {
        updateResult();
        return false;
    };

    $scope.onExport = function () {
        var ugr = angular.copy($scope.resultDS.ugr);

        if (ugr.entities.length == 0) {
            return;
        }

        ugr.where = convertCriteriaToWhere($scope.filterBuilderCtrl.getCriteria(true));
        ugr.order = [];
        angular.forEach($scope.resultCtrl.getSort(), function (s) {
            ugr.order.push({alias: s.property, asc: s.direction == 'ascending'});
        });
        $http.post('api/database/uni-grid-request/export', {unigrid: ugr}).
            success(function (data, status, headers, config) {
                // check for a filename
                var filename = 'export.csv';
                var type = 'text/csv';
                var header = '';
                // TODO: add header string
                //angular.forEach($scope.resultCtrl.getFields(), function (field) {
                //    if (!$scope.resultCtrl.isRowNumberField(field)) {
                //        header += field.title + ';';
                //    }
                //});
                //header += '\n';
                var blob = new Blob([header, data], {type: type});

                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === 'undefined') {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 100); // cleanup
                }
            }).
            error(function (data, status, headers, config) {
            });
    };

    function getUniGridRequest() {
        function processTreeLevel(parent) {
            var res = {attributes: []};
            if (parent.type == 'entity') {
                res.id = parent.entity.id;
                res.relation = null;
            } else {
                res.id = parent.relation.rel_entity;
                res.relation = {
                    attr_parent: parent.relation.own_attr
                };
            }
            angular.forEach(parent.children, function (child) {
                if (child.type == 'field' && $scope.fieldsTreeCtrl.isSelected(child)) {
                    res.attributes.push({
                        id: child.field.id,
                        alias: child.alias,
                        selected: child.select,
                        summaries: child.summaries
                    });
                } else if (child.type == 'relation') {
                    var childEntity = processTreeLevel(child);
                    if (childEntity) {
                        res.attributes.push({entity: childEntity});
                    }
                }
            });
            if (res.attributes.length == 0) {
                return null;
            }
            return res;
        }

        var entities = [];
        angular.forEach($scope.fieldsTreeCtrl.data.getRoot().children, function (root) {
            if (root.type === 'entity') {
                var e = processTreeLevel(root);
                if (e) {
                    entities.push(e);
                }
            }
        });

        return {
            entities: entities
        };
    }

    function convertCriteriaToWhere(criteria) {
        var ops = {
            iEquals: {name: 'IEQ', vals: [{type: 'v', name: 'value'}]},
            iNotEqual: {name: 'NOT_IEQ', vals: [{type: 'v', name: 'value'}]},
            iBetweenInclusive: {name: 'IBETWEEN_INC', vals: [{type: 'v', name: 'start'}, {type: 'v', name: 'end'}]},
            betweenInclusive: {name: 'BETWEEN_INC', vals: [{type: 'v', name: 'start'}, {type: 'v', name: 'end'}]},
            iContains: {name: 'ILIKE', vals: [{type: 'v', name: 'value'}]},
            iNotContains: {name: 'NOT_ILIKE', vals: [{type: 'v', name: 'value'}]},
            iStartsWith: {name: 'ISTARTS_WITH', vals: [{type: 'v', name: 'value'}]},
            iNotStartsWith: {name: 'NOT_ISTARTS_WITH', vals: [{type: 'v', name: 'value'}]},
            iEndsWith: {name: 'IENDS_WITH', vals: [{type: 'v', name: 'value'}]},
            iNotEndsWith: {name: 'NOT_IENDS_WITH', vals: [{type: 'v', name: 'value'}]},
            iEqualsField: {name: 'IEQ', vals: [{type: 'a', name: 'value'}]},
            iNotEqualField: {name: 'NOT_IEQ', vals: [{type: 'a', name: 'value'}]},
            inSet: {name: 'IN', vals: [{type: 'v', name: 'value'}]},
            notInSet: {name: 'NOT_IN', vals: [{type: 'v', name: 'value'}]},
            equals: {name: 'EQ', vals: [{type: 'v', name: 'value'}]},
            notEquals: {name: 'NOT_EQ', vals: [{type: 'v', name: 'value'}]},
            lessThan: {name: 'LT', vals: [{type: 'v', name: 'value'}]},
            lessOrEqual: {name: 'LTE', vals: [{type: 'v', name: 'value'}]},
            greaterThan: {name: 'GT', vals: [{type: 'v', name: 'value'}]},
            greaterOrEqual: {name: 'GTE', vals: [{type: 'v', name: 'value'}]},
            isNull: {name: 'IS_NULL', vals: []},
            notNull: {name: 'NOT_IS_NULL', vals: []},
            equalsField: {name: 'EQ', vals: [{type: 'a', name: 'value'}]},
            notEqualsField: {name: 'NOT_EQ', vals: [{type: 'a', name: 'value'}]},
            greaterThanField: {name: 'GT', vals: [{type: 'a', name: 'value'}]},
            greaterOrEqualField: {name: 'GTE', vals: [{type: 'a', name: 'value'}]},
            lessThanField: {name: 'LT', vals: [{type: 'a', name: 'value'}]},
            lessOrEqualField: {name: 'LTE', vals: [{type: 'a', name: 'value'}]}
        };
        var where = {};
        if (criteria._constructor == 'AdvancedCriteria') {
            where.cond = {
                with: angular.uppercase(criteria.operator),
                entries: []
            };
            angular.forEach(criteria.criteria, function (c) {
                if (!ops[c.operator]) {
                    where.cond.entries.push(convertCriteriaToWhere(c));
                } else {
                    var e = {
                        func: {
                            name: ops[c.operator].name,
                            args: [
                                {alias: c.fieldName}
                            ]
                        }
                    };
                    angular.forEach(ops[c.operator].vals, function (n) {
                        if (n.type == 'v') {
                            e.func.args.push({value: c[n.name]});
                        } else if (n.type == 'a') {
                            e.func.args.push({alias: c[n.name]});
                        }
                    });
                    where.cond.entries.push(e);
                }
            });
        }
        return where;
    }

    function updateResult() {
        var editorCriteria = $scope.resultCtrl.getFilterEditorCriteria();
        var simpleEditorCriteria = editorCriteria;
        if (editorCriteria && !isc.DataSource.isAdvancedCriteria(editorCriteria)) {
            editorCriteria = isc.DataSource.convertCriteria(editorCriteria);
        }
        var newCriteria = $scope.filterBuilderCtrl.getCriteria();
        if (editorCriteria && newCriteria) {
            newCriteria = isc.DataSource.combineCriteria(newCriteria, editorCriteria);
        } else if (editorCriteria) {
            newCriteria = editorCriteria;
        }
        //$scope.resultCtrl.setFilterEditorCriteria(simpleEditorCriteria);
        $scope.resultCtrl.fetchData(newCriteria);
        $scope.resultCtrl.setFilterEditorCriteria(simpleEditorCriteria);
        console.log('New result filter criteria\n' + angular.toJson(newCriteria, true));
    }
});
