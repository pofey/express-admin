
var pagination = require('sr-pagination');
var query = require('../sql/query'),
    sql = require('../sql/sql');


exports.get = function (args, cb) {
    var table = args.config.table,
        s = args.statements;

    var str = query.replace('total', sql.concat(table.name, table.pk), sql.table(s.table), s.join, s.where);
    args.log && console.log('list'.cyan, str);
    args.db.client.query(str, function (err, rows) {
        if (err) return cb(err);
        var total = parseInt(rows[0].count),
            rows = args.config.listview.page,
            page = parseInt(args.page || 1);
        cb(null, pagination({page: page, links: 9, rows: rows, total: total}));
    });
}
