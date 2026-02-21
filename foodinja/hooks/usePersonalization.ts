import { useGetPersonalizationQuery, useUpdatePersonalizationMutation } from '@/redux/service/app';
import type { UpdatePersonalizationRequest, PersonalizationSettings } from '@/types/api';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

interface UsePersonalizationResult {
  settings: PersonalizationSettings | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  error: any;
  updateSettings: (settings: UpdatePersonalizationRequest) => Promise<PersonalizationSettings | undefined>;
  refetch: () => void;
}

export function usePersonalization(): UsePersonalizationResult {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useGetPersonalizationQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updatePersonalization, { isLoading: isUpdating }] = useUpdatePersonalizationMutation();

  const updateSettings = async (
    newSettings: UpdatePersonalizationRequest
  ): Promise<PersonalizationSettings | undefined> => {
    try {
      const result = await updatePersonalization(newSettings).unwrap();
      return result;
    } catch (err) {
      console.error('Error updating personalization:', err);
      throw err;
    }
  };

  return {
    settings,
    isLoading,
    isUpdating,
    error,
    updateSettings,
    refetch,
  };
}
