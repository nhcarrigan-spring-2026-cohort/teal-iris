import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProficiencyLevel } from '../utilis/proficiency';

export interface UserLanguage {
  id: string;
  language: string;
  proficiency: ProficiencyLevel;
}

interface AddLanguagePayload {
  language: string;
  proficiency: ProficiencyLevel;
}


const fetchUserLanguages = async (): Promise<UserLanguage[]> => {
  const res = await fetch('/api/user/languages');
  if (!res.ok) throw new Error('Failed to fetch languages');
  return res.json();
};

const addUserLanguage = async (payload: AddLanguagePayload): Promise<UserLanguage> => {
  const res = await fetch('/api/user/languages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add language');
  return res.json();
};

const deleteUserLanguage = async (id: string): Promise<void> => {
  const res = await fetch(`/api/user/languages/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete language');
};


export const useUserLanguages = () =>
  useQuery({
    queryKey: ['user-languages'],
    queryFn: fetchUserLanguages,
  });

export const useAddLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUserLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-languages'] });
    },
  });
};

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-languages'] });
    },
  });
};