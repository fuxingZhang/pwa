/**
 * Created by zfx on 7/5/2018
 * routes
 */
const fs = require('fs');

const paths = fs.readdirSync(__dirname).filter(path => path != 'index.js');

const routes = paths.map( path => require(`./${path}`));

module.exports = routes;