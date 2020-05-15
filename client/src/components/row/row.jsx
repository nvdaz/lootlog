import { h } from 'preact';
import { memo } from 'preact/compat';
import formatDistance from 'date-fns/formatDistance';

import Reward from '../reward';
import format from '../../util/format';
import classes from './row.module';

export default memo(function _Row({
  style,
  index,
  data: {
    [index]: {
      rewards,
      dragonType,
      gross,
      eyesPlaced,
      leaderboardPlacement,
      lastUpdated,
    },
  },
}) {
  return (
    <div style={style} className={classes.row}>
      <div className={classes.columnRewards}>
        {rewards.map((reward) => (
          <Reward
            type="DRAGON_REWARD"
            reward={reward}
            dragonType={dragonType}
          />
        ))}
      </div>
      <div className={classes.columnNet}>
        <span>{`${format(gross, { sign: true })} coins`}</span>
      </div>
      <div className={classes.columnEyes}>
        <span>{`${eyesPlaced} eyes`}</span>
      </div>
      <div className={classes.columnPlacement}>
        <span>{`#${leaderboardPlacement}`}</span>
      </div>
      <div className={classes.columnUpdated}>
        <span>
          {formatDistance(lastUpdated, Date.now(), {
            addSuffix: true,
          }).replace(/^about ?/, '')}
        </span>
      </div>
    </div>
  );
});
