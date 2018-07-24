"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
function reactRouter(router) {
    router.use(function (req, res) {
        fs_1.readFile(path_1.join(__dirname, '../public/index.html'), 'utf8', function (err, data) {
            res.send(data);
        });
    });
    return router;
}
exports.default = reactRouter;
