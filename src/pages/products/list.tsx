import {
  Grid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Input as ChakraInput,
  Divider,
  RadioGroup,
  Radio,
  Stack,
  useToast,
  Skeleton,
  Flex,
  Icon,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Tag,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import {
  AiOutlineCalculator,
  AiOutlineEdit,
  AiOutlinePercentage,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineTool,
} from "react-icons/ai";
import { GiCardboardBox } from "react-icons/gi";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { useQuery, useMutation, QueryClient } from "react-query";
import { api, configs } from "../../configs";

type Props = {
  id: string;
  token: string;
};

type ProductProps = {
  id: string;
  thumbnail?: string;
  title: string;
  sku: string;
  sale_value: number;
  active: boolean;
  in_promotion: boolean;
  type_unit: "square_meter" | "meter" | "unity" | "weight" | "liter";
  unit_desc: string;
  inventory: number;
  weight: number;
  liter: number;
  length: number;
  isTributed: boolean;
};

export default function ListProduct() {
  const toast = useToast();

  const [auth, setAuth] = useState<Props>();

  const [search, setSearch] = useState<string>("all");
  const [textSearch, setTextSearch] = useState<string>("");

  const [allProducts, setAllProducts] = useState<ProductProps[]>();
  const [products, setProducts] = useState<ProductProps[]>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);

  function handleSearch(type: string) {
    setTextSearch("");
    setSearch(type);
  }

  function showToast(
    message: string,
    status: "error" | "info" | "warning" | "success" | undefined,
    title: string
  ) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "top-right",
      duration: 8000,
      isClosable: true,
    });
  }

  async function getInformation() {
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
    try {
      const { data } = await api.get(`/products/${companyParse?.id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  const paginateGood = (array: ProductProps[], page_size: number) => {
    const pag = array.slice(page * page_size, page * page_size + page_size);
    setProducts(pag);
  };

  const { data, isLoading, error } = useQuery("list-products", getInformation, {
    refetchInterval: 4000,
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setAllProducts(data);
    }
  }, [data]);

  useEffect(() => {
    if (allProducts) {
      paginateGood(allProducts, configs.pagination);
      setPages(Math.ceil(data.length / configs.pagination));
    }
  }, [allProducts]);

  useEffect(() => {
    if (allProducts) {
      paginateGood(allProducts, configs.pagination);
    }
  }, [page]);

  return (
    <Fragment>
      <Grid templateColumns={"200px 1fr"} gap={3}>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              colorScheme={"blue"}
              variant="outline"
              leftIcon={<HiOutlineAdjustments />}
            >
              Filtrar por
            </Button>
          </PopoverTrigger>
          <PopoverContent shadow={"lg"}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Filtros</PopoverHeader>
            <PopoverBody>
              <RadioGroup value={search} onChange={(e) => handleSearch(e)}>
                <Stack>
                  <Radio value={"all"}>Todos os Produtos</Radio>
                  <Radio value={"active"}>Produtos Ativos</Radio>
                  <Radio value={"locked"}>Produtos Bloqueados</Radio>
                  <Radio value={"promotional"}>Produtos Promocionais</Radio>
                  <Radio value={"name"}>Buscar por Nome</Radio>
                </Stack>
              </RadioGroup>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <ChakraInput
          placeholder="Digite para Buscar"
          isDisabled={search === "name" ? false : true}
        />
      </Grid>
      <Divider mt={5} mb={5} />

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
          {products?.length === 0 ? (
            <Flex justify={"center"} align="center" direction={"column"}>
              <Icon as={GiCardboardBox} fontSize="8xl" />
              <Text>Nenhuma informação para mostrar</Text>
            </Flex>
          ) : (
            <Fragment>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th w="5%" textAlign={"center"}></Th>
                    <Th w="3%" textAlign={"center"}>
                      Ativo?
                    </Th>
                    <Th w="3%" textAlign={"center"}>
                      Promocional?
                    </Th>
                    <Th w="3%" textAlign={"center"}>
                      Tributado?
                    </Th>
                    <Th>Nome</Th>
                    <Th>SKU</Th>
                    <Th>Uni.</Th>
                    <Th isNumeric>Estoque</Th>
                    <Th isNumeric>Preço</Th>
                    <Th textAlign={"center"} w="12%">
                      Opções
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((pro) => (
                    <Tr key={pro.id}>
                      <Td w="5%" textAlign={"center"}>
                        <Avatar src={pro.thumbnail} size="sm" />
                      </Td>
                      <Td w="3%" textAlign={"center"}>
                        <Switch defaultChecked={pro.active} />
                      </Td>
                      <Td w="3%" textAlign={"center"}>
                        {pro.in_promotion === true ? (
                          <Tag colorScheme={"green"}>SIM</Tag>
                        ) : (
                          <Tag colorScheme={"red"}>NÃO</Tag>
                        )}
                      </Td>
                      <Td w="3%" textAlign={"center"}>
                        {pro.isTributed === true ? (
                          <Tag colorScheme={"green"}>SIM</Tag>
                        ) : (
                          <Tag colorScheme={"red"}>NÃO</Tag>
                        )}
                      </Td>
                      <Td>{pro.title}</Td>
                      <Td>{pro.sku}</Td>
                      <Td>{pro.unit_desc}</Td>
                      <Td isNumeric>
                        {(pro.type_unit === "square_meter" && "Indefinido") ||
                          (pro.type_unit === "unity" &&
                            `${pro.inventory} ${pro.unit_desc}`) ||
                          (pro.type_unit === "liter" &&
                            `${pro.liter} ${pro.unit_desc}`) ||
                          (pro.type_unit === "meter" &&
                            `${pro.length} ${pro.unit_desc}`) ||
                          (pro.type_unit === "weight" &&
                            `${pro.weight} ${pro.unit_desc}`)}
                      </Td>
                      <Td isNumeric>
                        {parseFloat(pro.sale_value.toString()).toLocaleString(
                          "pt-br",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </Td>
                      <Td textAlign={"center"} w="12%">
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<AiOutlineTool />}
                            size="xs"
                            isFullWidth
                          >
                            Opções
                          </MenuButton>
                          <MenuList>
                            <MenuItem icon={<AiOutlineEdit />}>
                              Alterar Informações
                            </MenuItem>
                            <MenuItem icon={<AiOutlinePercentage />}>
                              Alterar Tributação
                            </MenuItem>
                            <MenuItem icon={<AiOutlinePicture />}>
                              Alterar Imagens
                            </MenuItem>
                            <MenuItem icon={<MdOutlineLocalShipping />}>
                              Alterar Frete
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem icon={<AiOutlineCalculator />}>
                              Promoções
                            </MenuItem>
                          </MenuList>
                        </Menu>
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
    </Fragment>
  );
}
