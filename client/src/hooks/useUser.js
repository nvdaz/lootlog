import { useQuery } from '@apollo/client';

import { useState, useEffect } from 'preact/hooks';
import DRAGONS_QUERY from '../queries/dragons';
import DRAGONS_SUBSCRIPTION from '../queries/dragonSub';

export default function useUser({ username, initialDate = -1 }) {
  const [date, setDate] = useState(initialDate);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(
    DRAGONS_QUERY,
    {
      variables: { username, date, utcOffset: new Date().getTimezoneOffset() },
    },
  );

  useEffect(() => {
    if (!loading && !error && (date === -1 || Date.now() - date < 8.64e7))
      subscribeToMore({
        document: DRAGONS_SUBSCRIPTION,
        variables: { owner: data.userByName._id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          return {
            ...prev,
            userByName: {
              ...prev.userByName,
              dragons: [
                subscriptionData.data.dragonAdded,
                ...prev.userByName.dragons,
              ].sort((a, b) => b.timestamp - a.timestamp),
            },
          };
        },
      });
  }, [data, loading, error, subscribeToMore, date]);

  const loadMoreItems = (startIndex, stopIndex) => {
    if (isLoadingMore) return Promise.resolve();

    setIsLoadingMore(true);
    return fetchMore({
      variables: {
        username,
        day: -1,
        skip: startIndex,
        limit: Math.min(50, stopIndex - startIndex),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!prev) return fetchMoreResult;
        if (!fetchMoreResult) return prev;

        const dragons = [...prev.userByName.dragons];

        fetchMoreResult.userByName.dragons.forEach((dragon, i) => {
          if (!dragons[startIndex + i]) dragons[startIndex + i] = dragon;
        });

        setIsLoadingMore(false);

        return {
          ...prev,
          userByName: {
            ...prev.userByName,
            dragons,
          },
        };
      },
    });
  };

  if (error)
    return {
      loadMoreItems: () => {},
      displayName: null,
      dragons: [],
      dragonOverviews: [],
      currentOverview: {},
      error,
    };

  const { userByName = {} } = data || {};
  const { displayName, dragons = [], dragonOverviews = [] } = userByName || {};

  const currentOverview = dragonOverviews.find(({ day }) => day === date) || {};

  return {
    loadMoreItems,
    displayName,
    dragons,
    dragonOverviews,
    currentOverview,
    loading,
    error,
    date,
    setDate,
  };
}
