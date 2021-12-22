import * as mongoose from 'mongoose';

export const QuoteSchema = new mongoose.Schema({
  external_id: Number,
  author: String,
  quote: String,
  permalink: String,
  watches: {
    type: Number,
    default: 1,
  },
  likes: {
    type: Number,
    default: 0,
  },
  hash: String,
});
