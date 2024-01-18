import mongoose, { Document, Model, Schema } from 'mongoose';

interface IBlacklist {
  token: string;
}

interface IBlacklistDocument extends IBlacklist, Document {}

const blacklistSchema = new Schema<IBlacklistDocument>({
  token: { type: String, required: true },
});

const BlacklistModel: Model<IBlacklistDocument> = mongoose.model('Blacklist', blacklistSchema);

export { BlacklistModel };