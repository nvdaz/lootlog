import { h } from 'preact';

import Loading from '../../components/loading';
import { Button } from '../../components/button';
import useVersions from '../../hooks/useVersions';
import classes from './changelog.module';

export default function Changelog() {
  const versions = useVersions();

  if (versions.length === 0) return <Loading />;

  const handleDownload = (download) => () => (window.location = download);
  return (
    <div className={classes.container}>
      {versions.map(({ version, etag, changes, download }, i) => (
        <div className={classes.versionContainer}>
          <span className={classes.version}>{`v${version}`}</span>
          <span className={classes.etag}>{`build ${etag}`}</span>
          <ul>
            {changes.map((change) => (
              <li>{change}</li>
            ))}
          </ul>
          {i === 0 && download && (
            <Button
              onClick={handleDownload(download)}
              style={{ margin: 0, display: 'block' }}
            >
              download
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
