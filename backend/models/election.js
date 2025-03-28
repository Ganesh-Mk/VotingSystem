const mongoose = require("mongoose");
require('./candidate')

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }]
});

module.exports = mongoose.model("Election", ElectionSchema);