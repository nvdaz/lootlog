import { h, VNode } from 'preact';
import { memo } from 'preact/compat';
import formatDistance from 'date-fns/formatDistance';
import ObjectID from 'bson-objectid';

import Reward from '../reward';
import format from '../../util/format';
import { IDragon } from '../../hooks/useUserDragons';
import classes from './row.module.scss';

interface IRowProperties {
  style: React.CSSProperties;
  index: number;
  data: IDragon[];
}

export default memo(function Row({
  style,
  index,
  data: {
    [index]: {
      _id,
      rewards,
      dragonType,
      gross,
      eyesPlaced,
      leaderboardPlacement,
    },
  },
}: IRowProperties): VNode<IRowProperties> {
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
          {formatDistance(new ObjectID(_id).getTimestamp(), Date.now(), {
            addSuffix: true,
          }).replace(/^about ?/, '')}
        </span>
      </div>
    </div>
  );
});
