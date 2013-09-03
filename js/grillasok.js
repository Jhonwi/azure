$.ig.loader({
    scriptPath: 'http://cdn-na.infragistics.com/jquery/20131/latest/js/',
    cssPath: 'http://cdn-na.infragistics.com/jquery/20131/latest/css/',
    theme: 'metro'
});


$.ig.loader("igGrid.Responsive.Hiding.Paging.Updating", function () {
    $("#grilladedatos").igGrid({
        height: "500px",
        dataSource: 'http://domain.com/admin-new/users.php?mode=getUsers',
        updateUrl: 'http://domain.com/admin-new/users.php?mode=updateUser',
        responseDataKey: "results",
        primaryKey: 'id',
        autoGenerateColumns: false,
        autoGenerateLayouts: false,
        columns: [{
            FechaIngreso: 'FechaIngreso',
            dataType: 'number',
            headerText: 'Fecha Ingreso'
        }, {
            key: 'Nombres',
            dataType: 'string',
            headerText: 'Full Name'
        }, {
            key: 'fname',
            dataType: 'string',
            headerText: 'First name'
        }, {
            key: 'lname',
            dataType: 'string',
            headerText: 'Last Name'
        }, {
            key: 'username',
            dataType: 'string',
            headerText: 'User Name'
        }, {
            key: 'userLevel',
            dataType: 'string',
            headerText: 'User Level'
        }, {
            key: 'userGroupId',
            dataType: 'string',
            headerText: 'User Group'
        }, {
            key: 'email',
            dataType: 'string',
            headerText: 'Email'
        }, {
            key: 'status',
            dataType: 'bool',
            headerText: 'Status'
        }],
        features: [{
            name: "Paging",
            type: "remote",
            pageSize: 2, // Default number of records per page.
            recordCountKey: 'totalCount', // The property in the response that will hold the total number of records in the data source.
            pageSizeUrlKey: 'psize', // Denotes the name of the encoded URL parameter that will state what is the currently requested page size.
            pageSizeList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30], // Default: [5, 10, 20, 25, 50, 75, 100]. contents of the page size dropdown indicating what preconfigured page sizes are available to the end user.
            pageIndexUrlKey: 'page' // Denotes the name of the encoded URL parameter that will state what is the currently requested page index.

        }, {
            name: 'Responsive',
            forceResponsiveGridWidth: false,
            columnSettings: [{
                columnKey: 'id',
                classes: "ui-hidden-phone"
            }, {
                columnKey: 'fullname',
                classes: "ui-visible-phone",
                configuration: {
                    phone: {
                        template: "<span>${lname}, ${fname}</span>"
                    }
                }
            }, {
                columnKey: 'fname',
                classes: "ui-hidden-phone"
            }, {
                columnKey: 'lname',
                classes: "ui-hidden-phone"
            }]
        }, {
            name: 'Hiding',
            hiddenColumnIndicatorHeaderWidth: 14,
            columnSettings: [{
                //hide unbound from chooser list and indicator
                columnKey: 'fullname',
                allowHiding: false
            }]
        }, {
            name: "Updating",
            enableAddRow: true,
            showReadonlyEditors: false,
            dataDirty: function (evt, ui) {
                return false;
            },
            rowEditDialogOpening: function (event, ui) {
                if ($(ui.owner.element).igGridResponsive("getCurrentResponsiveMode") != "desktop") {
                    ui.owner.options.rowEditDialogWidth = document.body.clientWidth * 0.9;
                    ui.dialogElement.children('.ui-dialog-content').css('height', ui.owner.grid.element.parent().height() - 115);
                    ui.owner.options.rowEditDialogHeight = ui.owner.grid.element.parent().height();
                }
                var columns = ui.owner.grid.options.columns;
                for (i = 0; i < columns.length; ++i) {
                    //use 0 instead of false to be able to differentiate when restoring state
                    if (columns[i].hidden) columns[i].hidden = 0;
                }
            },
            rowEditDialogOpened: function (event, ui) {
                var columns = ui.owner.grid.options.columns;
                for (i = 0; i < columns.length; ++i) {
                    if (columns[i].hidden === 0) columns[i].hidden = true;
                }
            },
            editMode: "rowedittemplate",
            columnSettings: [{
                columnKey: 'fullname',
                readOnly: true
            }, {
                columnKey: 'id',
                readOnly: true
            }, {
                columnKey: "email",
                validatorOptions: {
                    required: true,
                    errorMessage: "Enter a valid email.",
                    bodyAsParent: false
                }
            }]
        }]
    });
});
var grid = $('#grilladedatos');
grid.bind("iggridupdatingrowdeleting", function (e, args) {
    if (!confirm("Sure you want to delete ?")) {
        return false;
    }
});

$("#save").on('click', function () {
    $("#grilladedatos").igGrid("saveChanges");
});

// Mock datasource
$.mockjax({
    url: "http://domain.com/admin-new/users.php?mode=updateUser",
    contentType: 'text/json',
    response: function (settings) {
        var transactions = JSON.parse(settings.data.ig_transactions);
        for (i = 0; i < transactions.length; i++) {
            $('#log').prepend("<p> Update operation: '" + transactions[i].type + "'  on row with ID: " + transactions[i].rowId + "</p> ");
        }
        this.responseText = JSON.stringify({Success: true});
        //mock doesn't set the right header, jquery fails to parse...
        this.headers['Content-Type'] = "text/json";
    }
});

$.mockjax({
    url: "users.php?mode=deleteUser"
});

$.mockjax({
    url: 'http://domain.com/admin-new/users.php?mode=getUsers',
    responseTime: 250,
    contentType: 'text/json',
    responseText: {
        totalCount: 10,
        results: [{
            'id': 0,
                'fullname': '',
                'fname': 'John',
                'lname': 'Doe',
                'username': 'jdoe',
                'userLevel': 'master',
                'userGroupId': '34567890oj6789f',
                'email': 'johnd@mycompany.com',
                'status': true
        }, {
            'id': 1,
                'fullname': '',
                'fname': 'Jane',
                'lname': 'Doe',
                'username': 'janedoe',
                'userLevel': 'user',
                'userGroupId': '345fhth66789f',
                'email': 'janed@mycompany.com',
                'status': false
        }]
    },
    response: function (settings) {
        this.responseText = JSON.stringify(this.responseText);
    }
});

$.mockjaxSettings.log = function (mockHandler, requestSettings) {
    var message = 'MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url;
    $('#log').prepend("<p>" + message + "</p> ");
};