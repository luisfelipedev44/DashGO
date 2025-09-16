import {
  Box, Button, Checkbox, Flex, Heading, Icon, Table, Text,
  Tbody, Td, Th, Thead, Tr, useBreakpointValue, Spinner, Link as ChakraLink
} from "@chakra-ui/react";
import NextLink from "next/link";
import { RiAddLine } from "react-icons/ri";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { useUsers } from "@/services/hooks/useUsers";
import { useState, useEffect } from "react";
import { queryClient } from "@/services/queryClient";
import { api } from "@/services/api";

export default function UserList() {
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, isFetching, error } = useUsers(page);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

  if (!isClient) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar usuários.</Text>;
  }

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`users/${userId}`);
      return response.data;
    }, {
      staleTime: 1000 * 60 * 10 // 10 minutos
    });
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>
              Usuários
              {!isLoading && isFetching && <Spinner size='sm' color='gray.500' ml='4' />}
            </Heading>
            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size='sm'
                fontSize='sm'
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize='20' />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify="center"><Spinner /></Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={['4', '4', '6']} color='gray.300' width='8'>
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    <Th width='8'></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.users.map((user) => (
                    <Tr key={user.id}>
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <NextLink href={`/users/${user.id}`} passHref>
                          <ChakraLink color='purple.400' onMouseEnter={() => handlePrefetchUser(user.id)}>
                            <Text fontWeight="bold">{user.name}</Text>
                          </ChakraLink>
                        </NextLink>
                        <Text fontSize="sm" color="gray.300">{user.email}</Text>
                      </Td>
                      {isWideVersion && (
                        <Td>{user.createdAt}</Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={data?.totalCount ?? 0}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
