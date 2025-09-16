import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../api";

export type UserType = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type GetUsersResponse = {
  totalCount: number;
  users: UserType[];
};

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get('users', {
    params: {
      page,
    },
  });

  const totalCount = Number(headers['x-total-count']);

  const users = data.users.map((user: UserType) => {
    return {
      ...user,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return {
    users,
    totalCount,
  };
}

export function useUsers(
  page: number,
  options?: UseQueryOptions<GetUsersResponse, Error>
) {
  return useQuery<GetUsersResponse, Error>(
    ['users', page],
    () => getUsers(page),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options,
    }
  );
}
