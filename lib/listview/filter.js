var dcopy = require('deep-copy');


exports.prepareSession = function (req, args) {
    if (!req.session.filter) req.session.filter = {};
    var filter = req.session.filter;

    if ((req.method == 'GET' && !filter.hasOwnProperty(args.name))
        || (req.method == 'POST' && req.body.action.hasOwnProperty('clear'))) {
        filter[args.name] = {
            columns: {},
            order: '',
            direction: '',
            show: false
        };
    }
    else if (req.method == 'POST' && req.body.action.hasOwnProperty('filter')) {
        filter[args.name] = {
            columns: req.body.filter || {},
            order: req.body.order,
            direction: req.body.direction,
            show: true
        };
    }

    filter[args.name].page = args.page;

    return filter[args.name];
}

exports.getOrderColumns = function (req, args) {
    var order = [];
    for (var i = 0; i < args.config.columns.length; i++) {
        var column = args.config.columns[i];
        if (!column.listview.show) continue;
        if (column.name == args.filter.order) {
            column = dcopy(column);
            column.selected = true;
        }
        order.push(column);
    }
    return order;
}

exports.getColumns = function (args) {
    var filter = [];
    for (var i = 0; i < args.config.columns.length; i++) {
        if (!args.config.listview.filter) continue;
        for (var j = 0; j < args.config.listview.filter.length; j++) {
            if (args.config.columns[i].name == args.config.listview.filter[j]) {
                var column = dcopy(args.config.columns[i]);
                column.key = ['filter[', column.name, ']'].join('');
                filter.push(column);
            }
        }
    }
    return filter;
}
exports.getColumnSearch = function (req,res,args) {
    var filter = [];
    for (var i = 0; i < args.config.columns.length; i++) {
        var column = args.config.columns[i];
        if (column.searchview == undefined || !column.searchview.show) continue;
        var search = getSearchViewData(res,args,column);
        filter.push(search);
    }
    return filter;
}

function getSearchViewData(res,args,column) {
    var search = dcopy(column);
    search.key = ['filter[', column.name, ']'].join('');
    if (column.searchview.type == "excludeMany") {
        search.value = [
            {
                "active": true,
                "text": res.locals.string["search-show-all"],
                "value": 0
            },
            {
                "active": false,
                "text": res.locals.string["search-show-include"]+column.verbose,
                "value": 1
            },
            {
                "active": false,
                "text": res.locals.string["search-show-exclude"]+column.verbose,
                "value": 2
            }
        ];
    }
    return search;
}