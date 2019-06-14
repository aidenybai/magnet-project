import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  token: String
});

const Token = model('Token', TokenSchema);
export default Token;