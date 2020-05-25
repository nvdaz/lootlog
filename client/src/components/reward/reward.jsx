import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import rewards from '../../util/rewards';
import classes from './reward.module.scss';

export default function Reward({
  type = 'DRAGON_REWARD',
  dragonType,
  reward: { reward: item, count },
}) {
  const reward = rewards(item);

  const [image, setImage] = useState(null);

  useEffect(() => {
    reward.image(dragonType).then((module) => setImage(module.default));
  });

  if (type === 'DRAGON_REWARD') {
    if (image) {
      let sub;
      if (reward.sub) sub = reward.sub;
      else if (count > 1) sub = `${count}x`;
      return (
        <div className={classes.rewardContainer}>
          <img
            src={image}
            width="96"
            alt={reward.name}
            style={reward.imageStyle}
            className={classes.reward}
          />
          {sub && <span className={classes.count}>{sub}</span>}
        </div>
      );
    }
  }
  return <div />;
}
