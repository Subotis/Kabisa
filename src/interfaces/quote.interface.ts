import { Document } from 'mongoose';

export interface QuoteInterface extends Document {
  readonly external_id: number;
  readonly author: string;
  readonly quote: string;
  readonly permalink: string;
  readonly watches: number;
  readonly likes: number;
  readonly hash: string;
}
