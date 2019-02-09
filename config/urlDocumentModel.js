/**
 * Attualmente non in uso
 */
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const urlSchema = new Schema({}, { strict: false });

module.exports = mongoose.model('urls', urlSchema);

// Promemoria
// const urlSchema = new Schema({//Object
//   // microdata: 'Object',
//   // rdfa: 'Object',
//   // jsonld: 'Object',
//   // keyword: {
//   // 	type: 'String'
//   // },
//   // source: {
//   // 	type: 'String'
//   // },
//   // url: {
//   // 	type: 'String'
//   // },
//   // position: {
//   // 	type: 'String'
//   // }
//   // parsed.position = obj.position;
//   // parsed.url = url;
//   // parsed.source = obj.source;
//   // parsed.keyword = obj.keyword;
//   // parsed.formats = {}
//   // parsed.types = {};
//   // parsed.countTypes = 0;
// }, { strict: false });
