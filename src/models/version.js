import { model, Schema } from 'mongoose';
import memoize from 'memoize-one';
import { valid, rcompare, gte } from 'semver';

const VersionSchema = new Schema({
  version: {
    type: String,
    validate: valid,
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

const getVersions = memoize(async () =>
  (await Version.find({})).sort((a, b) => rcompare(a.version, b.version)),
);

VersionSchema.statics = {
  getVersions,
  isCurrent: async (version) => gte(version, (await getVersions())[0].version),
};

const Version = model('Version', VersionSchema);

export default Version;
