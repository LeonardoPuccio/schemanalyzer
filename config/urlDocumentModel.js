/**
 * Attualmente non in uso
 */
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const urlSchema = new Schema({}, { strict: false });

module.exports = mongoose.model('ultra-urls', urlSchema);
