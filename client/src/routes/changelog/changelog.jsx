import { h } from 'preact';

import Loading from '../../components/loading';
import { Button } from '../../components/button';
import ErrorComponent from '../../components/error';
import useVersions from '../../hooks/useVersions';
import { HTTP_ERROR } from '../../errors';
import classes from './changelog.module.scss';

export default function Changelog() {
  const { versions, loading, error } = useVersions();

  if (error) return <ErrorComponent error={HTTP_ERROR} />;
  if (loading) return <Loading />;

  const handleDownload = (download) => () => (window.location = download);
  return (
    <div className={classes.container}>
      {versions.map(({ version, etag, changes, download }, i) => (
        <div className={classes.versionContainer}>
          <h2 className={classes.version}>{`v${version}`}</h2>
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
