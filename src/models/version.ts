import { model, Schema, Model, Document } from 'mongoose';
import memoize from 'memoize-one';
import { valid, rcompare, gte, SemVer } from 'semver';

const VersionSchema = new Schema({
  version: {
    type: String,
    validate: (str): boolean => valid(str) != null,
    unique: true,
    rqeuired: true,
  },
  etag: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  changes: [
    {
      type: String,
      required: true,
    },
  ],
  download: {
    type: String,
    unique: true,
    sparse: true,
  },
});

export interface IVersion extends Document {
  version: string;
  etag: string;
  changes: string[];
  download?: string;
}

export interface IVersionModel extends Model<IVersion> {
  getVersions(): IVersion[];
  isCurrent(version: SemVer | string): boolean;
}

const getVersions = memoize(
  async (): Promise<IVersion[]> =>
    (await Version.find({})).sort((a, b) => rcompare(a.version, b.version)),
);

VersionSchema.statics = {
  getVersions,
  isCurrent: async (version: string): Promise<boolean> =>
    gte(version, (await getVersions())[0].version),
};

const Version: IVersionModel = model<IVersion, IVersionModel>(
  'Version',
  VersionSchema,
);

export default Version;
