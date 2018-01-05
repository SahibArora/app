const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pageSchema = new Schema({
  parentId: { type: String, default: '' },
  id: { type: String, default: '' },
  title: { type: String, default: '' },
  preview: { type: Boolean, default: false },
  editors: { type: Object, default: {} },
  indexEditor: { type: Number, default: 0 },
  textEditors: { type: Object, default: {} },
  indexTextEditor: { type: Number, default: 0 },
  iframes: { type: Object, default: {} },
  indexIframe: { type: Number, default: 0 },
}, { minimize: false });

module.exports = mongoose.model('page', pageSchema);
