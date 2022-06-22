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
  MenuDivider,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineCalculator,
  AiOutlineEdit,
  AiOutlinePartition,
  AiOutlinePercentage,
  AiOutlinePicture,
  AiOutlineSave,
  AiOutlineTool,
} from "react-icons/ai";
import { GiCardboardBox } from "react-icons/gi";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { useQuery, useMutation, QueryClient } from "react-query";
import { api, configs } from "../../configs";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { dataTrib } from "../../configs/data";
import Input from "../../components/Input";
import Select from "../../components/Select";

const queryClient = new QueryClient();

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
  type_unit:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without";
  unit_desc: string;
  inventory: number;
  weight: number;
  liter: number;
  length: number;
  type_sale: "unique" | "partition";
};

type TaxProps = {
  id: string;
  cfop: string;
  ncm: string;
  icms_rate: number;
  icms_origin: string;
  icms_csosn: string;
  icms_st_rate: number;
  icms_marg_val_agregate: number;
  icms_st_mod_bc: string;
  icms_base_calc: number;
  imcs_st_base_calc: number;
  fcp_rate: number;
  fcp_st_rate: number;
  fcp_ret_rate: number;
  fcp_base_calc: number;
  fcp_st_base_calc: number;
  ipi_cst: string;
  ipi_rate: number;
  ipi_code: string;
  pis_cst: string;
  pis_rate: number;
  pis_base_calc: number;
  cofins_cst: string;
  cofins_rate: number;
  cofins_base_calc: number;
  cest: string;
  isTributed: boolean;
};

type ActiveProductProps = {
  id: string;
  active: boolean;
};

export default function ListProduct() {
  const toast = useToast();
  const formRefTax = useRef<FormHandles>(null);

  const [auth, setAuth] = useState<Props>();

  const [search, setSearch] = useState<string>("all");
  const [textSearch, setTextSearch] = useState<string>("");

  const [products, setProducts] = useState<ProductProps[]>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalTax, setModalTax] = useState<boolean>(false);
  const [isTributed, setIsTributed] = useState<boolean>(true);

  const [tax, setTax] = useState<TaxProps>();
  const [productId, setProductId] = useState<string>("");

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
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  function filterSearch(array: ProductProps[]) {
    if (search === "all") {
      paginateGood(array, configs.pagination);
      setPages(Math.ceil(array.length / configs.pagination));
    } else if (search === "active") {
      let resultActive = array.filter((obj) => obj.active === true);
      paginateGood(resultActive, configs.pagination);
      setPages(Math.ceil(resultActive.length / configs.pagination));
    } else if (search === "locked") {
      let resultLocked = array.filter((obj) => obj.active === false);
      paginateGood(resultLocked, configs.pagination);
      setPages(Math.ceil(resultLocked.length / configs.pagination));
    } else if (search === "promotional") {
      let resultPromo = array.filter((obj) => obj.in_promotion === true);
      paginateGood(resultPromo, configs.pagination);
      setPages(Math.ceil(resultPromo.length / configs.pagination));
    } else if (search === "name") {
      if (textSearch === "") {
        paginateGood(array, configs.pagination);
        setPages(Math.ceil(array.length / configs.pagination));
      } else {
        let resultName = array.filter((obj) =>
          obj.title.toLowerCase().includes(textSearch.toLowerCase())
        );
        paginateGood(resultName, configs.pagination);
        setPages(Math.ceil(resultName.length / configs.pagination));
      }
    }
  }

  useEffect(() => {
    if (data) {
      filterSearch(data);
    }
  }, [search]);

  useEffect(() => {
    if (data) {
      filterSearch(data);
    }
  }, [data]);

  useEffect(() => {
    if (products) {
      paginateGood(products, configs.pagination);
    }
  }, [page]);

  function handleSearchName(text: string) {
    setTextSearch(text);
    if (text === "") {
      paginateGood(data, configs.pagination);
      setPages(Math.ceil(data.length / configs.pagination));
    } else {
      let allProducts: ProductProps[] = data;
      let result = allProducts.filter((obj) =>
        obj.title.toLowerCase().includes(text.toLowerCase())
      );
      paginateGood(result, configs.pagination);
      setPages(Math.ceil(result.length / configs.pagination));
    }
  }

  const handleFindTax = async (id: string) => {
    try {
      setLoadingModal(true);
      setModalTax(true);
      setProductId(id);
      const response = await api.get(`/findTaxesProduct/${id}`);
      setTax(response.data);
      setIsTributed(response.data.isTributed);
      setLoadingModal(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  const updateTax: SubmitHandler<TaxProps> = async (data, { reset }) => {
    try {
      setLoading(true);
      const response = await api.put(
        `/updateProductTax/${tax?.id}/${productId}`,
        {
          cfop: data.cfop,
          ncm: data.ncm,
          icms_rate: data.icms_rate,
          icms_origin: data.icms_origin,
          icms_csosn: data.icms_csosn,
          icms_st_rate: data.icms_st_rate,
          icms_marg_val_agregate: data.icms_marg_val_agregate,
          icms_st_mod_bc: data.icms_st_mod_bc,
          icms_base_calc: data.icms_base_calc,
          imcs_st_base_calc: data.imcs_st_base_calc,
          fcp_rate: data.fcp_rate,
          fcp_st_rate: data.fcp_st_rate,
          fcp_ret_rate: data.fcp_ret_rate,
          fcp_base_calc: data.fcp_base_calc,
          fcp_st_base_calc: data.fcp_st_base_calc,
          ipi_cst: data.ipi_cst,
          ipi_rate: data.ipi_rate,
          ipi_code: data.ipi_code,
          pis_cst: data.pis_cst,
          pis_rate: data.pis_rate,
          pis_base_calc: data.pis_base_calc,
          cofins_cst: data.cofins_cst,
          cofins_rate: data.cofins_rate,
          cofins_base_calc: data.cofins_base_calc,
          cest: data.cest,
          isTributed: isTributed,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      showToast(response.data.message, "success", " Sucesso");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  const mutationActive = useMutation(
    (data: ActiveProductProps) => {
      return api.put(
        `/productsActive/${data.id}`,
        {
          active: data.active,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list-products");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        } else {
          const message = (error as Error).message;
          showToast(message, "error", "Erro");
        }
      },
    }
  );

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
          value={textSearch}
          onChange={(e) => handleSearchName(e.target.value)}
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
                    <Th w="5%" textAlign={"center"}>
                      Thumb
                    </Th>
                    <Th w="3%" textAlign={"center"}>
                      Ativo?
                    </Th>
                    <Th w="3%" textAlign={"center"}>
                      Promocional?
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
                        <Switch
                          defaultChecked={pro.active}
                          onChange={(e) =>
                            mutationActive.mutate({
                              id: pro.id,
                              active: e.target.checked,
                            })
                          }
                        />
                      </Td>
                      <Td w="3%" textAlign={"center"}>
                        {pro.in_promotion === true ? (
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
                            `${pro.weight} ${pro.unit_desc}`) ||
                          (pro.type_unit === "without" && "Venda sem Estoque")}
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
                            <MenuItem
                              icon={<AiOutlinePercentage />}
                              onClick={() => handleFindTax(pro.id)}
                            >
                              Alterar Tributação
                            </MenuItem>
                            <MenuItem icon={<AiOutlinePicture />}>
                              Alterar Imagens
                            </MenuItem>
                            <MenuItem icon={<MdOutlineLocalShipping />}>
                              Alterar Frete
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem icon={<AiOutlineAppstoreAdd />}>
                              Items Adicionais
                            </MenuItem>
                            <MenuItem icon={<AiOutlinePartition />}>
                              Venda Particionada
                            </MenuItem>
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

      <Modal isOpen={modalTax} onClose={() => setModalTax(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tributação</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {loadingModal ? (
              <Stack spacing={3}>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
              </Stack>
            ) : (
              <Form ref={formRefTax} onSubmit={updateTax} initialData={tax}>
                <Stack spacing={3}>
                  <Grid templateColumns={"1fr 1fr 1fr 1fr"} gap={3}>
                    <FormControl>
                      <FormLabel>Produto Tributado?</FormLabel>
                      <Switch
                        defaultChecked={isTributed}
                        onChange={(e) => setIsTributed(e.target.checked)}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>CEST</FormLabel>
                      <Input
                        placeholder="CEST"
                        name="cest"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>NCM</FormLabel>
                      <Input
                        placeholder="NCM"
                        name="ncm"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>CFOP</FormLabel>
                      <Input
                        placeholder="CFOP"
                        name="cfop"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                    <FormControl>
                      <FormLabel>ICMS Origem</FormLabel>
                      <Select
                        placeholder="Selecione uma opção"
                        name="icms_origin"
                        isDisabled={!isTributed}
                      >
                        <option value={"0"}>0 - Nacional</option>
                        <option value={"1"}>
                          1 - Estrangeira (importação direta)
                        </option>
                        <option value={"2"}>
                          2 - Estrangeira (adquirida no mercado interno)
                        </option>
                        <option value={"3"}>
                          3 - Nacional com mais de 40% de conteúdo estrangeiro
                        </option>
                        <option value={"4"}>
                          4 - Nacional produzida através de processos produtivos
                          básicos
                        </option>
                        <option value={"5"}>
                          5 - Nacional com menos de 40% de conteúdo estrangeiro
                        </option>
                        <option value={"6"}>
                          6 - Estrangeira (importação direta) sem produto
                          nacional similar
                        </option>
                        <option value={"7"}>
                          7 - Estrangeira (adquirida no mercado interno) sem
                          produto nacional similar
                        </option>
                        <option value={"8"}>
                          8 - Nacional, mercadoria ou bem com Conteúdo de
                          Importação superior a 70%;
                        </option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>ICMS CSOSN</FormLabel>
                      <Select
                        name="icms_csosn"
                        placeholder="Selecione uma opção"
                        isDisabled={!isTributed}
                      >
                        <option value={"101"}>
                          101 - Tributada pelo Simples Nacional com permissão de
                          crédito
                        </option>
                        <option value={"102"}>
                          102 - Tributada pelo Simples Nacional sem permissão de
                          crédito
                        </option>
                        <option value={"103"}>
                          103 - Isenção do ICMS no Simples Nacional para faixa
                          de receita bruta
                        </option>
                        <option value={"201"}>
                          201 - Tributada pelo Simples Nacional com permissão de
                          crédito e com cobrança do ICMS por substituição
                          tributária
                        </option>
                        <option value={"202"}>
                          202 - Tributada pelo Simples Nacional sem permissão de
                          crédito e com cobrança do ICMS por substituição
                          tributária
                        </option>
                        <option value={"203"}>
                          203 - Isenção do ICMS no Simples Nacional para faixa
                          de receita bruta e com cobrança do ICMS por
                          substituição tributária
                        </option>
                        <option value={"300"}>300 - Imune</option>
                        <option value={"400"}>
                          400 - Não tributada pelo Simples Nacional
                        </option>
                        <option value={"500"}>
                          500 - ICMS cobrado anteriormente por substituição
                          tributária (substituído) ou por antecipação
                        </option>
                        <option value={"900"}>900 - Outros</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>ICMS Alíquota (%)</FormLabel>
                      <Input
                        name="icms_rate"
                        placeholder="ICMS Alíquota"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>ICMS Base de Cálculo</FormLabel>
                      <Input
                        name="icms_base_calc"
                        placeholder="ICMS Base de Cálculo"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                    <FormControl>
                      <FormLabel>
                        <Tooltip label="Margem de valor agregado" hasArrow>
                          <Text>ICMS MVA (%)</Text>
                        </Tooltip>
                        <Input
                          name="icms_marg_val_agregate"
                          placeholder="Margem de valor agregado"
                          isDisabled={!isTributed}
                        />
                      </FormLabel>
                    </FormControl>
                    <FormControl>
                      <FormLabel>ICMS ST Alíquota (%)</FormLabel>
                      <Input
                        name="icms_st_rate"
                        placeholder="ICMS ST Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>ICMS ST Modalidade de Cálculo (%)</FormLabel>
                      <Select
                        name="icms_st_mod_bc"
                        placeholder="Selecione uma opção"
                        isDisabled={!isTributed}
                      >
                        <option value={"0"}>
                          Preço tabelado ou máximo sugerido
                        </option>
                        <option value={"1"}>Lista Negativa (valor)</option>
                        <option value={"2"}>Lista Positiva (valor)</option>
                        <option value={"3"}>Lista Neutra (valor)</option>
                        <option value={"4"}>Margem Valor Agregado (%)</option>
                        <option value={"5"}>Pauta (valor)</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>ICMS ST Base de Cálculo</FormLabel>
                      <Input
                        name="imcs_st_base_calc"
                        placeholder="ICMS ST Base de Cálculo"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                  <Divider />
                  <Grid templateColumns={"repeat(5, 1fr)"} gap={3}>
                    <FormControl>
                      <FormLabel>FCP Alíquota (%)</FormLabel>
                      <Input
                        name="fcp_rate"
                        placeholder="FCP Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>FCP ST Alíquota (%)</FormLabel>
                      <Input
                        name="fcp_st_rate"
                        placeholder="FCP ST Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>FCP Ret. Alíquota (%)</FormLabel>
                      <Input
                        name="fcp_ret_rate"
                        placeholder="FCP Ret. Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>FCP Base de Cálculo</FormLabel>
                      <Input
                        name="fcp_base_calc"
                        placeholder="FCP Base de Cálculo"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>FCP ST Base de Cálculo</FormLabel>
                      <Input
                        name="fcp_st_base_calc"
                        placeholder="FCP ST Base de Cálculo"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                  <Divider />
                  <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                    <FormControl>
                      <FormLabel>IPI CST</FormLabel>
                      <Select
                        name="ipi_cst"
                        placeholder="Selecione uma opção"
                        isDisabled={!isTributed}
                      >
                        <option value={""}>Nenhum</option>
                        <option value={"00"}>
                          00 – Entrada com Recuperação de Crédito
                        </option>
                        <option value={"01"}>
                          01 – Entrada Tributada com Alíquota Zero
                        </option>
                        <option value={"02"}>02 – Entrada Isenta</option>
                        <option value={"03"}>03 – Entrada Não Tributada</option>
                        <option value={"04"}>04 – Entrada Imune</option>
                        <option value={"05"}>05 – Entrada com Suspensão</option>
                        <option value={"49"}>49 – Outras Entradas</option>
                        <option value={"50"}>50 – Saída Tributada</option>
                        <option value={"51"}>
                          51 – Saída Tributável com Alíquota Zero
                        </option>
                        <option value={"52"}>52 – Saída Isenta</option>
                        <option value={"53"}>53 – Saída Não Tributada</option>
                        <option value={"54"}>54 – Saída Imune</option>
                        <option value={"55"}>55 – Saída com Suspensão</option>
                        <option value={"99"}>99 – Outras Saídas</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>IPI Alíquota (%)</FormLabel>
                      <Input
                        name="ipi_rate"
                        placeholder="IPI Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>IPI Código</FormLabel>
                      <Input
                        name="ipi_code"
                        placeholder="IPI Código"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                  <Divider />
                  <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                    <FormControl>
                      <FormLabel>PIS CST</FormLabel>
                      <Select
                        name="pis_cst"
                        placeholder="Selecione uma opção"
                        isDisabled={!isTributed}
                      >
                        {dataTrib.map((dt) => (
                          <option key={dt.code} value={dt.code}>
                            {dt.desc}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>PIS Alíquota (%)</FormLabel>
                      <Input
                        name="pis_rate"
                        placeholder="PIS Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>PIS Base de Cálculo</FormLabel>
                      <Input
                        name="pis_base_calc"
                        placeholder="PIS Base de Cálculo"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                  <Divider />
                  <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                    <FormControl>
                      <FormLabel>COFINS CST</FormLabel>
                      <Select
                        name="cofins_cst"
                        placeholder="Selecione uma opção"
                        isDisabled={!isTributed}
                      >
                        {dataTrib.map((dt) => (
                          <option key={dt.code} value={dt.code}>
                            {dt.desc}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>COFINS Alíquota (%)</FormLabel>
                      <Input
                        name="cofins_rate"
                        placeholder="COFINS Alíquota (%)"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>COFINS Base de Cálculo</FormLabel>
                      <Input
                        name="cofins_base_calc"
                        placeholder="COFINS Base de Cálculo"
                        isDisabled={!isTributed}
                      />
                    </FormControl>
                  </Grid>
                </Stack>

                <Flex justify={"end"}>
                  <Button
                    colorScheme={"blue"}
                    leftIcon={<AiOutlineSave />}
                    mt={5}
                    type="submit"
                    isLoading={loading}
                  >
                    Salvar
                  </Button>
                </Flex>
              </Form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
