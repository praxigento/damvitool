/**
 * <h3>Isomorphic SmartClient Widgets Library for AngularJS.</h3>
 *
 * Allows you to use Isomorphic SmartClient (ISC) Library widgets in AngularJS projects.
 *
 <!doctype html>
 <html ng-app="sampleApp">
 <head>
 <!-- setup Isomorphic SmartClient -->
 <script>var isomorphicDir = "lib/isomorphic/";</script>
 <script src="lib/isomorphic/system/modules/ISC_Core.js"></script>
 <script src="lib/isomorphic/system/modules/ISC_Foundation.js"></script>
 <script src="lib/isomorphic/system/modules/ISC_Containers.js"></script>
 <script src="lib/isomorphic/system/modules/ISC_Grids.js"></script>
 <script src="lib/isomorphic/system/modules/ISC_Forms.js"></script>
 <script src="lib/isomorphic/system/modules/ISC_DataBinding.js"></script>
 <script src="lib/isomorphic/system/modules/ISC_RichTextEditor.js"></script>
 <script src="lib/isomorphic/skins/SmartClient/load_skin.js"></script>

 <script src="lib/js/angular.min.js"></script>

 <script src="ng-isc.js"></script>

 <style type="text/css">
 html, body {
                    height: 100%;
                    margin: 0px;
                    padding: 0px;
                }

 *
 .full {
                    width: 100%;
                    height: 100%;
                }
 </style>
 </head>
 <body ng-controller="SampleCtrl">
 <!--root isomorphic directive must be defined as attribute in valid html tag, because ISC control get his dimensions-->
 <div class="full" isc-v-layout sc-width="'100%'" sc-height="'100%'">
 <isc-list-grid sc-width="'100%'" sc-height="'50%'" sc-fields="fields" sc-data="data" ng-model="value"
 sc-show-resize-bar="true" sc-on-row-double-click="onDoubleClick"></isc-list-grid>
 <isc-dynamic-form sc-width="'100%'" sc-height="'*'" sc-fields="fields" ng-model="value"></isc-dynamic-form>
 <isc-rich-text-editor sc-width="'100%'" sc-height="'10%'" ng-model="out"></isc-rich-text-editor>
 </div>

 <script type="text/javascript">
 angular.module('sampleApp', ['ng-isc']).controller('SampleCtrl', ['$scope', function ($scope) {
                    $scope.fields = [
                        {name: 'name'},
                        {name: 'value'}
                    ];
                    $scope.data = [
                        {name: 'one', value: 1},
                        {name: 'two', value: 2},
                        {name: 'three', value: 3}
                    ];
                    $scope.out = '';
                    $scope.onDoubleClick = function (record, recordNum, fieldNum) {
                        $scope.out += 'Record ' + recordNum + ' double clicked<br>';
                    };
                }]);
 </script>
 </body>
 </html>
 *
 * In order to create ISC control, you must use directive with the name of ISC control class name and prefix 'isc'.
 * For example, if you want to create ListGrid widget, you must use directive 'iscListGrid' as a tag name or attribute.
 *
 * Each property of ISC control which can be put in create(props) function or set by a setter, can be determined
 * through attribute with prefix 'sc-' and a name of a property. For example, for the property showEdges you must
 * add attribute sc-show-edges="true". All 'sc-' attributes values are evaluated before use, i.e. all strings must
 * be quoted with single-quotes (sc-name="'Hello world!'" or sc-name="'Hello {{name}}!'").
 *
 * In order to subscribe to ISC control events you must use the attributes with prefix 'sc-on-'.
 *
 * Also you can initialize ISC control by passing config object through attribute 'sc-config-object'.

 // controller
 function SampleCtrl($scope) {
            $scope.config = {
                width: '100%',
                height: '100%'
            };
        }

 // html
 <isc-h-layout sc-config-object="config"></isc-h-layout>
 *
 * @module ng-isc
 *
 * @license ng-isc v0.2.0
 * (c) 2014 Praxigento
 * License: LGPL
 *
 * @author alex-smirnov <smirnov-fl@yandex.ru>
 */
/*global define, angular, window, document */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        /* List of AMD modules to be loaded with RequireJS. */
        var amdDepends = ['angular', 'isomorphic'];
        define(amdDepends, factory);
    } else {
        factory();
    }
}(function () {
    'use strict';

    // attributes ignored in common processing
    var ignoredAttributes = [
        'scConfigObject'
    ];


    /* ISC init */
    var isc = window.isc;
    if (!isc.Page.isLoaded()) {
        isc.Page.finishedLoading();
        // load css for skin manually
        // he is not load automatically on async ISC loading
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = isc.Page.getURL("[SKIN]/skin_styles.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    /* NG modules dependencies. */
    var ngDepends = [];
    var ngMod = angular.module('ng-isc', ngDepends);

    // list of all SC control classes
    ngMod.Types = [
    /**
     * iscLayout directive
     * @class iscLayout
     */
        {
            name: 'Layout',
            addChildName: 'addMember'
        },

    /**
     * iscVLayout directive
     * @class iscVLayout
     */
        {
            name: 'VLayout',
            addChildName: 'addMember'
        },

    /**
     * iscHLayout directive
     * @class iscHLayout
     */
        {
            name: 'HLayout',
            addChildName: 'addMember'
        },

    /**
     * iscTreeGrid directive
     * @class iscTreeGrid
     */
        {
            name: 'TreeGrid',
            addChildName: 'addMember'
        },

    /**
     * iscListGrid directive
     * @class iscListGrid
     */
        {
            name: 'ListGrid',
            addChildName: 'addMember'
        },

    /**
     * iscDynamicForm directive
     * @class iscDynamicForm
     */
        {
            name: 'DynamicForm',
            addChildName: 'addMember'
        },

    /**
     * iscSlider directive
     * @class iscSlider
     */
        {
            name: 'Slider',
            addChildName: 'addMember'
        },

    /**
     * iscRangeSlider directive
     * @class iscRangeSlider
     */
        {
            name: 'RangeSlider',
            addChildName: 'addMember'
        },

    /**
     * iscRichTextEditor directive
     * @class iscRichTextEditor
     */
        {
            name: 'RichTextEditor',
            addChildName: 'addMember'
        },

    /**
     * iscImg directive
     * @class iscImg
     */
        {
            name: 'Img',
            addChildName: 'addMember'
        },

    /**
     * iscStretchImg directive
     * @class iscStretchImg
     */
        {
            name: 'StretchImg',
            addChildName: 'addMember'
        },

    /**
     * iscLabel directive
     * @class iscLabel
     */
        {
            name: 'Label',
            addChildName: 'addMember'
        },

    /**
     * iscHTMLFlow directive
     * @class iscHTMLFlow
     */
        {
            name: 'HTMLFlow',
            addChildName: 'addMember'
        },

    /**
     * iscHTMLPane directive
     * @class iscHTMLPane
     */
        {
            name: 'HTMLPane',
            addChildName: 'addMember'
        },

    /**
     * iscDialog directive
     * @class iscDialog
     */
        {
            name: 'Dialog',
            addChildName: 'addMember',
            appendToParent: false
        },

    /**
     * iscMenu directive
     * @class iscMenu
     */
        {
            name: 'Menu',
            addChildName: 'addMember'
        },

    /**
     * iscMenuButton directive
     * @class iscMenuButton
     */
        {
            name: 'MenuButton',
            addChildName: 'addMember'
        },

    /**
     * iscIMenuButton directive
     * @class iscIMenuButton
     */
        {
            name: 'IMenuButton',
            addChildName: 'addMember'
        },

    /**
     * iscMenuBar directive
     * @class iscMenuBar
     */
        {
            name: 'MenuBar',
            addChildName: 'addMember'
        },

    /**
     * iscButton directive
     * @class iscButton
     */
        {
            name: 'Button',
            addChildName: 'addMember'
        },

    /**
     * iscIButton directive
     * @class iscIButton
     */
        {
            name: 'IButton',
            addChildName: 'addMember'
        },

    /**
     * iscAutoFitButton directive
     * @class iscAutoFitButton
     */
        {
            name: 'AutoFitButton',
            addChildName: 'addMember'
        },

    /**
     * iscProgressbar directive
     * @class iscProgressbar
     */
        {
            name: 'Progressbar',
            addChildName: 'addMember'
        },

    /**
     * iscImgButton directive
     * @class iscImgButton
     */
        {
            name: 'ImgButton',
            addChildName: 'addMember'
        },

    /**
     * iscStretchImgButton directive
     * @class iscStretchImgButton
     */
        {
            name: 'StretchImgButton',
            addChildName: 'addMember'
        },

    /**
     * iscTabSet directive
     * @class iscTabSet
     */
        {
            name: 'TabSet',
            addChildName: 'addTab'
        },

    /**
     * iscTab directive
     * @class iscTab
     */
        {
            name: 'Tab',
            create: function (ctrl, parentCtrl, props) {
                // add as member if parent is ISC control
                if (parentCtrl) {
                    props.pane = ctrl.members[0];
                    parentCtrl.addChild(props);
                }
            },
            addChild: function (child) {
                if (this.control) {
                    this.control.setTabPane(child, this.props);
                } else {
                    this.members.push(child);
                }
            }
        },

    /**
     * iscWindow directive
     * @class iscWindow
     */
        {
            name: 'Window',
            addChildName: 'addMember',
            appendToParent: false
        },

    /**
     * iscPortalLayout directive
     * @class iscPortalLayout
     */
        {
            name: 'PortalLayout',
            addChildName: 'addMember'
        },

    /**
     * iscPortlet directive
     * @class iscPortlet
     */
        {
            name: 'Portlet',
            addChildName: 'addMember'
        },

    /**
     * iscToolStrip directive
     * @class iscToolStrip
     */
        {
            name: 'ToolStrip',
            addChildName: 'addMember'
        },

    /**
     * iscHStack directive
     * @class iscHStack
     */
        {
            name: 'HStack',
            addChildName: 'addMember'
        },

    /**
     * iscVStack directive
     * @class iscVStack
     */
        {
            name: 'VStack',
            addChildName: 'addMember'
        },

    /**
     * iscLayoutSpacer directive
     * @class iscLayoutSpacer
     */
        {
            name: 'LayoutSpacer',
            addChildName: 'addMember'
        },

    /**
     * iscToolbar directive
     * @class iscToolbar
     */
        {
            name: 'Toolbar',
            addChildName: 'addMember'
        },

    /**
     * iscToolStripGroup directive
     * @class iscToolStripGroup
     */
        {
            name: 'ToolStripGroup',
            addChildName: 'addMember'
        },

    /**
     * iscIconButton directive
     * @class iscIconButton
     */
        {
            name: 'IconButton',
            addChildName: 'addMember'
        },

    /**
     * iscIconMenuButton directive
     * @class iscIconMenuButton
     */
        {
            name: 'IconMenuButton',
            addChildName: 'addMember'
        },

    /**
     * iscRibbonBar directive
     * @class iscRibbonBar
     */
        {
            name: 'RibbonBar',
            addChildName: 'addMember'
        },

    /**
     * iscSectionStack directive
     * @class iscSectionStack
     */
        {
            name: 'SectionStack',
            addChildName: 'addSection'
        },

    /**
     * iscSectionStackSection directive
     * @class iscSectionStackSection
     */
        {
            name: 'SectionStackSection',
            create: function (ctrl, parentCtrl, props) {
                // add as member if parent is ISC control
                if (parentCtrl) {
                    props.items = ctrl.members;
                    parentCtrl.addChild(props);
                }
            },
            addChild: function (child) {
                if (this.control) {
                    this.control.addItem(child, this.sectionId);
                } else {
                    this.members.push(child);
                }
            }
        },

    /**
     * iscSplitbar directive
     * @class iscSplitbar
     */
        {
            name: 'Splitbar',
            addChildName: 'addMember'
        },

    /**
     * iscImgSplitbar directive
     * @class iscImgSplitbar
     */
        {
            name: 'ImgSplitbar',
            addChildName: 'addMember'
        },

    /**
     * iscSnapbar directive
     * @class iscSnapbar
     */
        {
            name: 'Snapbar',
            addChildName: 'addMember'
        },

    /**
     * iscNavigationBar directive
     * @class iscNavigationBar
     */
        {
            name: 'NavigationBar',
            addChildName: 'addMember'
        },

    /**
     * iscSplitPane directive
     * @class iscSplitPane
     */
        {
            name: 'SplitPane',
            addChildName: 'addMember'
        },

    /**
     * iscDetailViewer directive
     * @class iscDetailViewer
     */
        {
            name: 'DetailViewer',
            addChildName: 'addMember'
        },

    /**
     * iscTileLayout directive
     * @class iscTileLayout
     */
        {
            name: 'TileLayout',
            addChildName: 'addMember'
        },

    /**
     * iscFlowLayout directive
     * @class iscFlowLayout
     */
        {
            name: 'FlowLayout',
            addChildName: 'addMember'
        },

    /**
     * iscTileGrid directive
     * @class iscTileGrid
     */
        {
            name: 'TileGrid',
            addChildName: 'addMember'
        },

    /**
     * iscColumnTree directive
     * @class iscColumnTree
     */
        {
            name: 'ColumnTree',
            addChildName: 'addMember'
        },

    /**
     * iscTableView directive
     * @class iscTableView
     */
        {
            name: 'TableView',
            addChildName: 'addMember'
        },

    /**
     * iscDOMGrid directive
     * @class iscDOMGrid
     */
        {
            name: 'DOMGrid',
            addChildName: 'addMember'
        },

    /**
     * iscDateGrid directive
     * @class iscDateGrid
     */
        {
            name: 'DateGrid',
            addChildName: 'addMember'
        },

    /**
     * iscDateChooser directive
     * @class iscDateChooser
     */
        {
            name: 'DateChooser',
            addChildName: 'addMember'
        },

    /**
     * iscSearchForm directive
     * @class iscSearchForm
     */
        {
            name: 'SearchForm',
            addChildName: 'addMember'
        },

    /**
     * iscColorPicker directive
     * @class iscColorPicker
     */
        {
            name: 'ColorPicker',
            addChildName: 'addMember'
        },

    /**
     * iscDateRangeDialog directive
     * @class iscDateRangeDialog
     */
        {
            name: 'DateRangeDialog',
            addChildName: 'addMember',
            appendToParent: false
        },

    /**
     * iscPropertySheet directive
     * @class iscPropertySheet
     */
        {
            name: 'PropertySheet',
            addChildName: 'addMember'
        },

    /**
     * iscFilterClause directive
     * @class iscFilterClause
     */
        {
            name: 'FilterClause',
            addChildName: 'addMember'
        },

    /**
     * iscFilterBuilder directive
     * @class iscFilterBuilder
     */
        {
            name: 'FilterBuilder',
            addChildName: 'addMember'
        },

    /**
     * iscCalendar directive
     * @class iscCalendar
     */
        {
            name: 'Calendar',
            addChildName: 'addMember'
        },

    /**
     * iscTimeline directive
     * @class iscTimeline
     */
        {
            name: 'Timeline',
            addChildName: 'addMember'
        },

    /**
     * iscDrawPane directive
     * @class iscDrawPane
     */
        {
            name: 'DrawPane',
            addChildName: 'addMember'
        },

    /**
     * iscGauge directive
     * @class iscGauge
     */
        {
            name: 'Gauge',
            addChildName: 'addMember'
        },

    /**
     * iscBrowserPlugin directive
     * @class iscBrowserPlugin
     */
        {
            name: 'BrowserPlugin',
            addChildName: 'addMember'
        },

    /**
     * iscApplet directive
     * @class iscApplet
     */
        {
            name: 'Applet',
            addChildName: 'addMember'
        },

    /**
     * iscFlashlet directive
     * @class iscFlashlet
     */
        {
            name: 'Flashlet',
            addChildName: 'addMember'
        },

    /**
     * iscSVG directive
     * @class iscSVG
     */
        {
            name: 'SVG',
            addChildName: 'addMember'
        },

    /**
     * iscActiveXControl directive
     * @class iscActiveXControl
     */
        {
            name: 'ActiveXControl',
            addChildName: 'addMember'
        }
    ];
    // list of component types with data binding
    ngMod.DataBindedTypes = ['TreeGrid', 'ListGrid', 'DynamicForm'];
    // prefix of library directives
    var prefix = 'isc';
    // isc events recursion counter
    var eventCounter = 0;

    angular.forEach(ngMod.Types, function (type) {
        //if (angular.isDefined(isc[type.name])) {
        var dirName = prefix + type.name;
        console.log('Register ' + dirName + ' directive');
        ngMod.directive(dirName, ['$parse', '$q', function ($parse, $q) {
            return {
                restrict: 'EA',
                require: [dirName, "?ngModel"],
                transclude: (dirName === 'iscHTMLFlow'),
                controller: function ($scope) {
                    var ctrl = this;
                    ctrl.members = [];

                    // create ISC control of the given type
                    ctrl.create = function (element, attrs) {

                        // search parent ng-isc library directive

                        var getCtrl = function (el, ctrlName) {
                            var c = el.controller(ctrlName);
                            if (c) {
                                var parentCtrl = el.parent().controller(ctrlName);
                                if (c !== parentCtrl) {
                                    return c;
                                }
                            }
                            return null;
                        };
                        var searchIscCtrl = function (el) {
                            for (var i = 0; i < ngMod.Types.length; i++) {
                                var ctrlName = prefix + ngMod.Types[i].name;
                                var ctrl = getCtrl(el, ctrlName);
                                if (ctrl) {
                                    return ctrl;
                                }
                            }
                            return null;
                        };
                        var parent = element.parent();
                        var parentCtrl = searchIscCtrl(parent);
                        if (!parentCtrl) {
                            while (getCtrl(parent, 'ngInclude')) {
                                parent = parent.parent();
                                parentCtrl = searchIscCtrl(parent);
                                if (parentCtrl) {
                                    break;
                                }
                            }
                        }

                        // properties for control creation
                        var props = {};
                        // event handlers
                        var handlers = {};

                        function processAttr(key, value, ev) {
                            if (ignoredAttributes.indexOf(key) === -1) {
                                var match = key.match(/^sc(On)?([A-Z].*)/);
                                if (match) {
                                    var name = match[2].charAt(0).toLowerCase() + match[2].slice(1);
                                    if (match[1]) { // if event handler
                                        if (name === 'dataFetch') { // if data handler
                                            handlers[name] = function () {
                                                var handler = ev && $scope.$eval(value) || value;
                                                return handler.apply($scope, arguments);
                                            };
                                        } else { // if common handler
                                            handlers[name] = function () {
                                                var args = arguments;
                                                var handler = ev && $scope.$eval(value) || value;
                                                var res = null;
                                                eventCounter++;
                                                if (eventCounter === 1) {
                                                    res = $scope.$apply(function () {
                                                        return handler.apply($scope, args);
                                                    });
                                                } else {
                                                    res = handler.apply($scope, args);
                                                }
                                                eventCounter--;
                                                return res;
                                            };
                                        }
                                    } else { // if property
                                        if (ev) {
                                            props[name] = $scope.$eval(value);
                                        } else {
                                            props[name] = value;
                                        }
                                    }
                                }
                            }
                        }

                        // process configObject
                        angular.forEach(attrs.scConfigObject && $scope.$eval(attrs.scConfigObject), function (value, key) {
                            processAttr('sc' + key.charAt(0).toUpperCase() + key.slice(1), value, false);
                        });
                        // process tag attributes
                        angular.forEach(attrs.$attr, function (value, key) {
                            processAttr(key, attrs[key], true);
                        });

                        if (parentCtrl === null) {
                            //props.position = isc.Canvas.RELATIVE;
                            // define fake object for computing percent dimensions
                            props.percentSource = {
                                _isA_Canvas: true,
                                element: element[0],
                                getVisibleWidth: function () {
                                    return this.element.clientWidth;
                                },
                                getVisibleHeight: function () {
                                    return this.element.clientHeight;
                                }
                            };
                            props.htmlElement = element[0];
                        }

                        ctrl.className = type.name;
                        if (type.create) {
                            ctrl.control = type.create(ctrl, parentCtrl, props);
                        } else {
                            // create ISC control
                            ctrl.control = isc[type.name].create(props);
                            if (ctrl.members.length > 0) {
                                angular.forEach(ctrl.members, function (value) {
                                    ctrl.addChild(value);
                                });
                            }
                            // add as member if parent is ISC control
                            if (parentCtrl && (angular.isUndefined(type.appendToParent) || type.appendToParent)) {
                                parentCtrl.addChild(ctrl.control);
                                //                            } else {
                                //                                /* Set DOM element to the root of the current ISC-control. */
                                //                                ctrl.control.setHtmlElement(element[0]);
                            }

                            // subscribe to control events
                            angular.forEach(handlers, function (value, key) {
                                // save default handler
                                var defaultHandler = ctrl.control[key];
                                ctrl.control[key] = function () {
                                    var res = value.apply(this, arguments);
                                    if (res !== false && angular.isFunction(defaultHandler)) {
                                        // exec default handler
                                        defaultHandler.apply(this, arguments);
                                    }
                                    return res;
                                };
                            });

                            // subscribe to the all attributes values
                            angular.forEach(attrs.$attr, function (value, key) {
                                var match = key.match(/^sc(On)?([A-Z].*)/);
                                if (match && !match[1]) {
                                    var setName = 'set' + match[2];
                                    var getName = 'get' + match[2];
                                    attrs.$observe(key, function (newValue) {
                                        if (angular.isFunction(ctrl.control[setName])) {
                                            var value = $scope.$eval(newValue);
                                            var oldValue = angular.isFunction(ctrl.control[getName]) && ctrl.control[getName].length == 0 && ctrl.control[getName]();
                                            if (oldValue !== value) {
                                                console.log('call ' + ctrl.control.ID + '.' + setName + '(' + angular.toJson(value) + ')');
                                                ctrl.control[setName](value);
                                            }
                                        }
                                    });
                                }
                            });

                            // export direct object reference
                            if (attrs[dirName]) {
                                var set = $parse(attrs[dirName]).assign;
                                if (set) {
                                    set($scope, ctrl.control);
                                } else {
                                    throw new Error('Can\'t assign to: ' + attrs[dirName]);
                                }
                            }
                        }
                    };

                    // add member to ISC control
                    ctrl.addChild = type.addChild || function (child) {
                        if (ctrl.control) {
                            ctrl.control[type.addChildName](child);
                        } else {
                            ctrl.members.push(child);
                        }
                    };
                },
                link: function (scope, element, attrs, ctrls, transcludeFn) {
                    var ctrl = ctrls[0];
                    var ngModel = ctrls[1];
                    // create control
                    ctrl.create(element, attrs);
                    // init data binding
                    if (ngMod.DataBindedTypes.indexOf(ctrl.className) !== -1 && !attrs.scDataSource) {
                        ctrl.dataFetch = (attrs.scDataFetch && scope.$eval(attrs.scDataFetch)) || ctrl.control.dataFetch;
                        var ds = isc.DataSource.create({
                            dataProtocol: "clientCustom",
                            fields: ctrl.control.fields,
                            transformRequest: function (dsRequest) {
                                if (dsRequest.operationType === "fetch") {
                                    if (angular.isFunction(ctrl.dataFetch)) {
                                        $q.when(ctrl.dataFetch.apply(scope, [dsRequest])).then(function (response) {
                                            ds.processResponse(dsRequest.requestId, response);
                                        });
                                    }
                                } else /*if (dsRequest.operationType === "update")*/ {
                                    ds.processResponse(dsRequest.requestId, {});
                                }
                            }
                        });
                        ctrl.control.setDataSource(ds);
                        ctrl.control.fetchData();
                    }

                    if (transcludeFn) {
                        var tmpl = transcludeFn();
                        angular.element(ctrl.control.getContentElement()).empty().append(tmpl);
                        ctrl.control.onDraw = function () {
                            angular.element(ctrl.control.getContentElement()).empty().append(tmpl);
                        };
                        //ctrl.control.setContents(null);
                    }

                    // ngModel binding
                    if (ngModel) {
                        // process change in model
                        ngModel.$render = function () {
                            if (ngModel.$viewValue) {
                                eventCounter++;
                                if (angular.isFunction(ctrl.control.setValues)) {
                                    ctrl.control.setValues(ngModel.$viewValue);
                                } else if (angular.isFunction(ctrl.control.setValue)) {
                                    ctrl.control.setValue(ngModel.$viewValue);
                                }
                                eventCounter--;
                            }
                        };

                        // process change in control
                        var updateModel = function () {
                            ngModel.$setViewValue(angular.isFunction(ctrl.control.getValue) && ctrl.control.getValue() || ctrl.control.getSelection());
                        };
                        //var eventName = 'selectionUpdated';
                        var eventName = 'selectionChanged';
                        if (angular.isFunction(ctrl.control.getValue)) {
                            eventName = 'valueChanged';
                        }
                        // save default handler
                        var defaultHandler = ctrl.control[eventName];
                        ctrl.control[eventName] = function () {
                            var h = function () {
                                updateModel();
                                try {
                                    if (angular.isFunction(defaultHandler)) {
                                        // exec default handler
                                        defaultHandler.apply(this, arguments);
                                    }
                                } catch (Exception) {
                                }
                                return true;
                            };
                            var res = null;
                            eventCounter++;
                            if (eventCounter === 1) {
                                res = scope.$apply(h);
                            } else {
                                res = h();
                            }
                            eventCounter--;
                            return res;
                        };
                        //updateModel();
                    }

                    // ngShow/ngHide support
                    scope.$watch(function () {
                        return element.hasClass('ng-hide');
                    }, function (newValue) {
                        if (!ctrl.control || !ctrl.control.isVisible) {
                            return;
                        }
                        var visible = ctrl.control.isVisible();
                        if (visible == newValue) {
                            if (newValue) {
                                ctrl.control.hide();
                            } else {
                                ctrl.control.parentResized();
                                ctrl.control.show();
                            }
                        }
                    });

                    // cleanup
                    element.on('$destroy', function () {
                        if (ctrl.control && ctrl.control.destroy) {
                            ctrl.control.destroy();
                        }
                    });
                }
            };
        }]);
        //}
    });

    return ngMod;
}));
