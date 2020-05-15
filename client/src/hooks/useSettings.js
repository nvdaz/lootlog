import { useEffect, useState } from 'preact/hooks';
import { useQuery, useMutation } from '@apollo/client';

import CURRENT_USER_QUERY from '../queries/currentUser';
import UPDATE_SETTINGS_MUTATION from '../queries/mutateSettings';

export default function useSettings() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY, {
    errorPolicy: 'all',
  });
  const [updateSettings, { error: mutationError }] = useMutation(
    UPDATE_SETTINGS_MUTATION,
    {
      update(
        cache,
        {
          data: {
            updateSettings: { displayName, eyePrice, username, minecraft },
          },
        },
      ) {
        const { currentUser } = cache.readQuery({ query: CURRENT_USER_QUERY });

        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: {
            currentUser: {
              ...currentUser,
              displayName,
              eyePrice,
              username,
              minecraft,
            },
          },
        });
      },
    },
  );
  const [currentDisplayName, setCurrentDisplayName] = useState(null);
  const [currentEyePrice, setCurrentEyePrice] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);

  useEffect(() => {
    if (!data || !data.currentUser) return;
    if (!currentDisplayName)
      setCurrentDisplayName(data.currentUser.displayName);
    if (!currentEyePrice) setCurrentEyePrice(data.currentUser.eyePrice);
    if (!currentUsername) setCurrentUsername(data.currentUser.username);
  }, [data, currentDisplayName, currentEyePrice, currentUsername]);

  if (error) return { error };

  const { displayName, eyePrice, username, minecraft } = data
    ? data.currentUser
    : {};

  return {
    loading,
    error,
    displayName,
    eyePrice,
    username,
    minecraft,
    currentDisplayName,
    currentEyePrice,
    currentUsername,
    setDisplayName: (updatedDisplayName) => {
      if (currentEyePrice !== eyePrice) setCurrentEyePrice(eyePrice);
      if (currentUsername !== username) setCurrentUsername(username);
      setCurrentDisplayName(updatedDisplayName);
      updateSettings({
        variables: { displayName: updatedDisplayName },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSettings: {
            __typename: 'User',
            displayName: updatedDisplayName,
            eyePrice,
            username,
            minecraft,
          },
        },
      });
    },
    setEyePrice: (updatedEyePrice) => {
      if (currentUsername !== username) setCurrentUsername(username);
      if (currentDisplayName !== displayName)
        setCurrentDisplayName(displayName);
      setCurrentEyePrice(updatedEyePrice);
      updateSettings({
        variables: { eyePrice: updatedEyePrice },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSettings: {
            __typename: 'User',
            displayName,
            eyePrice: updatedEyePrice,
            username,
            minecraft,
          },
        },
      });
    },
    setUsername: (updatedUsername) => {
      if (currentEyePrice !== eyePrice) setCurrentEyePrice(eyePrice);
      if (currentDisplayName !== displayName)
        setCurrentDisplayName(displayName);
      setCurrentUsername(updatedUsername);
      updateSettings({
        variables: { username: updatedUsername },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSettings: {
            __typename: 'User',
            displayName,
            eyePrice,
            username: updatedUsername,
            minecraft,
          },
        },
      });
    },
    setDisplayNameError:
      mutationError?.graphQLErrors[0]?.extensions?.validationErrors
        ?.displayName,
    setEyePriceError:
      mutationError?.graphQLErrors[0]?.extensions?.validationErrors?.eyePrice,
    setUsernameError:
      mutationError?.graphQLErrors[0]?.extensions?.validationErrors?.username,
  };
}
