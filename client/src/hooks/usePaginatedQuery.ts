import { useState, useEffect } from 'preact/hooks';
import {
  useQuery,
  DocumentNode,
  QueryHookOptions,
  ApolloError,
} from '@apollo/client';
import { UpdateQueryFn } from '@apollo/client/core/watchQueryOptions';

export type LoadMoreItemsFn = (
  startIndex: number,
  stopIndex: number,
) => Promise<void>;

interface IBasicSubscribeVariables {
  owner: string;
}

interface IPagintatedQueryOptions<D, V, S> {
  shouldSubscribeToMore: boolean;
  subscribeToMoreDocument: DocumentNode;
  fetchMoreUpdateQuery: (
    previousQueryResult: D,
    options: {
      fetchMoreResult?: D;
      variables?: V;
    },
  ) => D;
  subscribeToMoreUpdateQuery: UpdateQueryFn<D, IBasicSubscribeVariables, S>;
}

interface IPaginatedQueryResult<D> {
  data?: D;
  loading: boolean;
  error: ApolloError;
  loadMoreItems: LoadMoreItemsFn;
}

export interface IUserByNameQueryResult {
  userByName: {
    _id: string;
  };
}

export default function usePaginatedQuery<
  D extends IUserByNameQueryResult,
  V,
  S
>(
  query: DocumentNode,
  options: QueryHookOptions<D, V>,
  {
    shouldSubscribeToMore,
    subscribeToMoreDocument,
    fetchMoreUpdateQuery,
    subscribeToMoreUpdateQuery,
  }: IPagintatedQueryOptions<D, V, S>,
): IPaginatedQueryResult<D> {
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery<D, V>(
    query,
    options,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!loading && !error && shouldSubscribeToMore) {
      subscribeToMore<S, IBasicSubscribeVariables>({
        document: subscribeToMoreDocument,
        variables: { owner: data?.userByName?._id },
        updateQuery: (prev, options) => {
          if (!options?.subscriptionData?.data) return prev;

          return subscribeToMoreUpdateQuery(prev, options);
        },
      });
    }
  }, [
    data,
    loading,
    error,
    shouldSubscribeToMore,
    subscribeToMore,
    subscribeToMoreDocument,
    subscribeToMoreUpdateQuery,
  ]);

  const loadMoreItems = (
    startIndex: number,
    stopIndex: number,
  ): Promise<void> => {
    if (isLoadingMore) return Promise.resolve();

    setIsLoadingMore(true);
    return fetchMore({
      variables: {
        ...options.variables,
        skip: startIndex,
        limit: Math.min(50, stopIndex - startIndex),
      },
      updateQuery: (prev, options) => {
        if (!options.fetchMoreResult) return prev;

        setIsLoadingMore(false);
        return fetchMoreUpdateQuery(prev, options);
      },
    }).then(() => undefined);
  };

  return {
    data,
    loading,
    error,
    loadMoreItems,
  };
}
