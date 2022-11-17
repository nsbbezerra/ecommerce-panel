import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Select,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightAddon,
  useToast,
  ToastPositionWithLogical,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineTool } from "react-icons/ai";
import { BiLineChart } from "react-icons/bi";
import { FaBoxOpen, FaCashRegister } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { api, configs } from "../../configs";
import { useQuery } from "react-query";
import axios from "axios";
import format from "date-fns/format";

registerLocale("pt_br", pt_br);

type AuthProps = {
  id: string;
  token: string;
  user: string;
};

type EmployeeProps = {
  name: string;
};

type CashierProps = {
  id: string;
  employee: EmployeeProps;
  close_date: Date;
  close_value: string;
  open_date: Date;
  open_value: string;
  status: "opened" | "closed";
};

export default function CashierIndex() {
  const toast = useToast();
  const [search, setSearch] = useState<string>("all");
  const inputref = useRef(null);
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [auth, setAuth] = useState<AuthProps>();
  const [valueOfSearch, setValueOfSearch] = useState<string>("");
  const [openValue, setOpenValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [cashiers, setCashiers] = useState<CashierProps[]>([]);

  const CustomInput = forwardRef((props: any, ref) => {
    return <Input {...props} ref={ref} size="lg" />;
  });

  useEffect(() => {
    setValueOfSearch("");
  }, [search]);

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

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");

    if (companyParse && userParse) {
      setAuth({
        id: companyParse.id,
        token: userParse.token,
        user: userParse.user.id,
      });
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

  async function getInformation() {
    let companyId;
    if (!auth) {
      const company = localStorage.getItem("company");
      let companyParse = JSON.parse(company || "");
      companyId = companyParse.id;
    } else {
      companyId = auth.id;
    }
    try {
      const value = search === "data" ? saleDate : valueOfSearch;
      const { data } = await api.post(`/find_cashier/${companyId}`, {
        search,
        value,
      });
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

  const { data, error, isLoading } = useQuery("list-cashier", getInformation, {
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
    if (data) {
      setCashiers(data);
    }
  }, [error, data]);

  async function openCashier() {
    try {
      setLoading(true);
      const response = await api.post(
        `/cashier/${auth?.id}`,
        {
          employee_id: auth?.user,
          open_value: openValue,
          open_date: new Date(),
          close_value: 0,
          close_date: new Date(),
          status: "opened",
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      setOpenValue(0);
      showToast(response.data.message, "success", "Sucesso");
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
  }

  return (
    <Fragment>
      <Box py={3}>
        <HStack>
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <Button
                leftIcon={<FaCashRegister />}
                colorScheme="blue"
                size="lg"
                w="250px"
                minW={"250px"}
              >
                Novo Caixa
              </Button>
            </PopoverTrigger>
            <PopoverContent _focus={{ outline: "none" }} shadow="lg">
              <PopoverHeader fontWeight="semibold">
                Abertura de Caixa
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <FormControl>
                  <FormLabel>Valor de Abertura</FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      value={openValue}
                      onChange={(e) => setOpenValue(parseFloat(e.target.value))}
                    />
                    <InputRightAddon children="R$" />
                  </InputGroup>
                </FormControl>
              </PopoverBody>
              <PopoverFooter display="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button
                    colorScheme="blue"
                    leftIcon={<FaBoxOpen />}
                    isLoading={loading}
                    onClick={() => openCashier()}
                  >
                    Abrir
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
          <Select
            w="250px"
            size={"lg"}
            minW={"250px"}
            placeholder="Opções de busca"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          >
            <optgroup label="Buscar por:">
              <option value={"data"}>Data de abertura</option>
              <option value="status">Status</option>
              <option value={"all"}>Todos</option>
            </optgroup>
          </Select>

          {search === "data" && (
            <DatePicker
              selected={saleDate}
              onChange={(e) => setSaleDate(e || new Date())}
              customInput={<CustomInput inputRef={inputref} />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
              showPopperArrow={false}
            />
          )}
          {search === "status" && (
            <Select
              placeholder="Selecione uma opção"
              size="lg"
              value={valueOfSearch}
              onChange={(e) => setValueOfSearch(e.target.value)}
            >
              <option value={"opened"}>Aberto</option>
              <option value={"closed"}>Fechado</option>
            </Select>
          )}
        </HStack>

        {isLoading ? (
          <Stack mt={5}>
            <Skeleton h={7} />
            <Skeleton h={7} />
            <Skeleton h={7} />
            <Skeleton h={7} />
            <Skeleton h={7} />
          </Stack>
        ) : (
          <Table size={"sm"} mt={5}>
            <Thead>
              <Tr>
                <Th>Usuário</Th>
                <Th>Data de Abertura</Th>
                <Th isNumeric>Valor de Abertura</Th>
                <Th>Status</Th>
                <Th>Data de Fechamento</Th>
                <Th isNumeric>Valor de Fechamento</Th>
                <Th w="10%" textAlign={"center"}>
                  Opções
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {cashiers.map((cash) => (
                <Tr key={cash.id}>
                  <Td>{cash?.employee?.name}</Td>
                  <Td>{format(new Date(cash.open_date), "dd/MM/yyyy")}</Td>
                  <Td isNumeric>
                    {parseFloat(cash.open_value).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Td>
                  <Td>
                    {cash.status === "opened" ? (
                      <Tag colorScheme={"green"}>Aberto</Tag>
                    ) : (
                      <Tag colorScheme={"red"}>Fechado</Tag>
                    )}
                  </Td>
                  <Td>
                    {cash.status === "opened"
                      ? "-"
                      : format(new Date(cash.close_date), "dd/MM/yyyy")}
                  </Td>
                  <Td isNumeric>
                    {parseFloat(cash.close_value).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Td>
                  <Td>
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
                        {cash.status === "opened" ? (
                          <MenuItem icon={<BiLineChart />}>
                            Movimentar Caixa
                          </MenuItem>
                        ) : (
                          <MenuItem icon={<GiNotebook />}>
                            Ver Movimentação
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Fragment>
  );
}
