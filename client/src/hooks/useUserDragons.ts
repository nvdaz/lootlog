import { useState, StateUpdater } from 'preact/hooks';
import { ApolloError } from '@apollo/client';
import DRAGONS_QUERY from '../queries/dragons.graphql';
import DRAGONS_SUBSCRIPTION from '../queries/dragonSub.graphql';
import usePaginatedQuery, {
  LoadMoreItemsFn,
  IUserByNameQueryResult,
} from './usePaginatedQuery';

type ExtendedDate = Date | -1;

interface IUserDragon {
  username: string;
  initialDate: ExtendedDate;
}

enum DragonType {
  SUPERIOR = 'SUPERIOR',
  STRONG = 'STRONG',
  UNSTABLE = 'UNSTABLE',
  WISE = 'WISE',
  YOUNG = 'YOUNG',
  OLD = 'OLD',
  PROTECTOR = 'PROTECTOR',
}

enum DragonReward {
  HELMET = 'HELMET',
  CHESTPLATE = 'CHESTPLATE',
  LEGGINGS = 'LEGGINGS',
  BOOTS = 'BOOTS',
  ASPECT_OF_THE_DRAGONS = 'ASPECT_OF_THE_DRAGONS',
  LEGENDARY_PET = 'LEGENDARY_PET',
  EPIC_PET = 'EPIC_PET',
  DRAGON_SCALE = 'DRAGON_SCALE',
  DRAGON_CLAW = 'DRAGON_CLAW',
  DRAGON_HORN = 'DRAGON_HORN',
  FRAGMENTS = 'FRAGMENTS',
}

interface IDragonReward {
  reward: DragonReward;
  count: number;
  appraisal: number;
}

interface IDragon {
  _id: string;
  dragonType: DragonType;
  rewards: IDragonReward[];
  eyesPlaced: number;
  day: number;
  leaderboardPlacement: number;
  eyePrice: number;
  revenue: number;
  gross: number;
}

interface IDragonOverview {
  _id: string;
  day: ExtendedDate;
  dragonCount: number;
  dragonTypes: DragonType[];
  gross: number;
}

interface IDragonQueryVariables {
  username: string;
  date: ExtendedDate;
  skip?: number;
  limit?: number;
  utcOffset?: number;
}

interface IDragonQueryResult extends IUserByNameQueryResult {
  userByName: {
    _id: string;
    displayName: string;
    dragonOverviews: IDragonOverview[];
    dragons: IDragon[];
  };
}

interface IDragonSubResult {
  dragonAdded: IDragon;
}

interface IUserDragonOptions {
  username: string;
  initialDate: ExtendedDate;
}

interface IUserDragonResult {
  displayName: string;
  dragons: IDragon[];
  dragonOverviews: IDragonOverview[];
  currentOverview: IDragonOverview;
  loading: boolean;
  error: ApolloError;
  date: ExtendedDate;
  setDate: StateUpdater<ExtendedDate>;
  loadMoreItems: LoadMoreItemsFn;
}

export default function useUserDragons({
  username,
  initialDate = -1,
}: IUserDragonOptions): IUserDragonResult {
  const [date, setDate] = useState<ExtendedDate>(initialDate);
  const { data, loading, error, loadMoreItems } = usePaginatedQuery<
    IDragonQueryResult,
    IDragonQueryVariables,
    IDragonSubResult
  >(
    DRAGONS_QUERY,
    {
      variables: { username, date, utcOffset: new Date().getTimezoneOffset() },
    },
    {
      shouldSubscribeToMore:
        initialDate === -1 ||
        Date.now() - (date instanceof Date ? date.getTime() : date) < 8.64e7,
      subscribeToMoreDocument: DRAGONS_SUBSCRIPTION,
      fetchMoreUpdateQuery: (
        prev,
        { fetchMoreResult, variables: { skip } },
      ) => {
        const dragons = [...prev.userByName.dragons];

        fetchMoreResult.userByName.dragons.forEach((dragon, i) => {
          if (!dragons[skip + i]) dragons[skip + i] = dragon;
        });

        return {
          ...prev,
          userByName: {
            ...prev.userByName,
            dragons,
          },
        };
      },
      subscribeToMoreUpdateQuery: (prev, { subscriptionData }) => {
        return {
          ...prev,
          userByName: {
            ...prev.userByName,
            dragons: [
              ...prev.userByName.dragons,
              subscriptionData.data.dragonAdded,
            ],
          },
        };
      },
    },
  );

  const user = data?.userByName;

  return {
    displayName: user?.displayName,
    dragons: user?.dragons,
    dragonOverviews: user?.dragonOverviews || [],
    currentOverview: (user?.dragonOverviews || []).find(
      ({ day }) => day === date,
    ),
    loading,
    error,
    date,
    setDate,
    loadMoreItems,
  };
}
