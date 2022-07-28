import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { GiCardboardBox } from "react-icons/gi";
import { useQuery } from "react-query";
import { api, configs } from "../configs";

type ClientProps = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  street: string;
  number: string;
  comp?: string;
  district: string;
  zip_code: string;
  city: string;
  state: string;
};

type Props = {
  client: ClientProps;
};

const Clients = () => {
  const toast = useToast();

  const [clients, setClients] = useState<ClientProps[]>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [client, setClient] = useState<ClientProps>();
  const [address, setAddress] = useState<boolean>(false);

  function showToast(
    message: string,
    status: "error" | "info" | "warning" | "success" | undefined,
    title: string
  ) {
    toast({
      title: title,
      description: message,
      status: status,
      position: configs.toastPosition as ToastPositionWithLogical,
      duration: 8000,
      isClosable: true,
    });
  }

  async function getInformation() {
    try {
      const company = localStorage.getItem("company");
      const user = sessionStorage.getItem("user");
      let companyParse = JSON.parse(company || "");
      let userParse = JSON.parse(user || "");

      const { data } = await api.get(
        `/findClientsByCompany/${companyParse.id}`,
        {
          headers: { "x-access-authorization": userParse?.token || "" },
        }
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  const paginateGood = (array: ClientProps[], page_size: number) => {
    const pag = array.slice(page * page_size, page * page_size + page_size);
    setClients(pag);
  };

  const { isLoading, data, error } = useQuery("clients", getInformation, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log(data);
      paginateGood(data, configs.pagination);
      setPages(Math.ceil(data.length / configs.pagination));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      paginateGood(data, configs.pagination);
    }
  }, [page]);

  const search = (id: string) => {
    const result = clients?.find((obj) => obj.id === id);
    setClient(result);
    setAddress(true);
  };

  return (
    <Fragment>
      <Box py={3}>
        <Box borderWidth={"1px"} rounded="md" h="min-content" p={3}>
          {isLoading ? (
            <Stack spacing={3}>
              <Skeleton h={7} />
              <Skeleton h={7} />
              <Skeleton h={7} />
              <Skeleton h={7} />
              <Skeleton h={7} />
              <Skeleton h={7} />
              <Skeleton h={7} />
            </Stack>
          ) : (
            <Fragment>
              {clients?.length === 0 ? (
                <Flex justify={"center"} align="center" direction={"column"}>
                  <Icon as={GiCardboardBox} fontSize="8xl" />
                  <Text>Nenhuma informação para mostrar</Text>
                </Flex>
              ) : (
                <Fragment>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Nome</Th>
                        <Th>CPF</Th>
                        <Th>Telefone</Th>
                        <Th>Email</Th>
                        <Th>Endereço</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {clients?.map((cli) => (
                        <Tr key={cli.id || ""}>
                          <Td>{cli.name || ""}</Td>
                          <Td>{cli.cpf || ""}</Td>
                          <Td>{cli.phone || ""}</Td>
                          <Td>{cli.email || ""}</Td>
                          <Td>
                            <Button
                              isFullWidth
                              size="xs"
                              leftIcon={<AiOutlineSearch />}
                              onClick={() => search(cli.id || "")}
                            >
                              Visualizar
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Fragment>
              )}
              <Flex justify={"flex-end"} align="center" gap={3} mt={3}>
                <Button
                  size={"sm"}
                  onClick={() => setPage(page - 1)}
                  isDisabled={page + 1 === 1}
                >
                  Anterior
                </Button>
                <Text>
                  {page + 1} / {pages}
                </Text>
                <Button
                  size={"sm"}
                  onClick={() => setPage(page + 1)}
                  isDisabled={page + 1 === pages}
                >
                  Próxima
                </Button>
              </Flex>
            </Fragment>
          )}
        </Box>
      </Box>

      <Modal isOpen={address} onClose={() => setAddress(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Endereço</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table>
              <Tbody>
                <Tr>
                  <Th w="10%">Rua</Th>
                  <Td>{client?.street}</Td>
                </Tr>
                <Tr>
                  <Th w="10%">Número</Th>
                  <Td>{client?.number}</Td>
                </Tr>
                <Tr>
                  <Th w="10%">Comp.</Th>
                  <Td>{client?.comp}</Td>
                </Tr>
                <Tr>
                  <Th w="10%">Bairro</Th>
                  <Td>{client?.district}</Td>
                </Tr>
                <Tr>
                  <Th w="10%">CEP</Th>
                  <Td>{client?.zip_code}</Td>
                </Tr>
                <Tr>
                  <Th w="10%">Cidade</Th>
                  <Td>{client?.city}</Td>
                </Tr>
                <Tr>
                  <Th w="10%">Estado</Th>
                  <Td>{client?.state}</Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => setAddress(false)}
              leftIcon={<AiOutlineClose />}
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default Clients;
