import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  useColorModeValue,
  theme,
  Tag,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useColorMode,
  useToast,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineSave } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import axios from "axios";
import { api } from "../../configs";
import { format } from "date-fns";
import { GiCardboardBox } from "react-icons/gi";

type Props = {
  id: string;
  token: string;
};

type CouponProps = {
  id: string;
  dicount: string;
  coupon: string;
  period: "infinite" | "due_date" | "quantity";
  expires_date: Date;
  number_used: number;
};

registerLocale("pt_br", pt_br);

export default function Coupons() {
  const inputRef = useRef(null);
  const toast = useToast();
  const [coupon, setCoupon] = useState<string>("");
  const [dicount, setDicount] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [number_used, setNumber_used] = useState<string>("");
  const [expires_date, setExpires_date] = useState<Date>(new Date());
  const [auth, setAuth] = useState<Props>();

  const [coupons, setCoupons] = useState<CouponProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [loadingDel, setLoadingDel] = useState<boolean>(false);

  function clear() {
    setCoupon("");
    setDicount("");
    setPeriod("");
    setNumber_used("");
    setExpires_date(new Date());
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

  const CustomInput = forwardRef((props: any, ref) => {
    return <Input {...props} ref={ref} />;
  });

  async function findCoupons(id: string, token: string) {
    try {
      setSkeleton(true);
      const response = await api.get(`/coupons/${id}`);
      setCoupons(response.data);
      setSkeleton(false);
    } catch (error) {
      setSkeleton(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      findCoupons(companyParse.id, userParse.token);
      setAuth({ id: companyParse.id, token: userParse.token });
    }
  }, []);

  const storeCoupons = async () => {
    if (coupon === "") {
      showToast("Insira um nome para o cupom", "warning", "Atenção");
      return false;
    }
    if (dicount === "") {
      showToast("Insira um desconto para o cupom", "warning", "Atenção");
      return false;
    }
    if (period === "") {
      showToast("Selecione um modo de uso para o cupom", "warning", "Atenção");
      return false;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/coupons/${auth?.id}`,
        {
          coupon,
          dicount,
          period,
          number_used,
          expires_date,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setCoupons(response.data.coupons);
      setLoading(false);
      clear();
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

  async function deleteCoupon(id: string) {
    setLoadingDel(true);
    try {
      const response = await api.delete(`/coupons/${id}`, {
        headers: { "x-access-authorization": auth?.token || "" },
      });
      const updated = coupons?.filter((obj) => obj.id !== id);
      setCoupons(updated);
      showToast(response.data.message, "success", "Sucesso");
      setLoadingDel(false);
    } catch (error) {
      setLoadingDel(false);
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
        <Box borderWidth={"1px"} rounded="md" h="min-content" p={3}>
          <Grid templateColumns={"repeat(6, 1fr)"} gap={3} alignItems="end">
            <FormControl isRequired>
              <FormLabel>Cupom (Max. 10)</FormLabel>
              <Input
                placeholder="Cupom"
                autoFocus
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                maxLength={10}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Desconto (%)</FormLabel>
              <Input
                placeholder="Desconto (%)"
                value={dicount}
                onChange={(e) => setDicount(e.target.value)}
                type="number"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Modo de Uso</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="infinite">Sem Validade</option>
                <option value="due_date">Data de Vencimento</option>
                <option value="quantity">Quantidade</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Limite de Uso</FormLabel>
              <Input
                placeholder="Limite de Uso"
                value={number_used}
                onChange={(e) => setNumber_used(e.target.value)}
                type="number"
                isDisabled={period === "quantity" ? false : true}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Data de Expiração</FormLabel>
              <DatePicker
                selected={expires_date}
                onChange={(e) => setExpires_date(e || new Date())}
                customInput={<CustomInput inputRef={inputRef} />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
                showPopperArrow={true}
                disabled={period === "due_date" ? false : true}
              />
            </FormControl>
            <Button
              leftIcon={<AiOutlineSave />}
              colorScheme="blue"
              onClick={() => storeCoupons()}
              isLoading={loading}
            >
              Salvar
            </Button>
          </Grid>
          <Divider mt={3} mb={3} />

          {skeleton ? (
            <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
              <Skeleton w="full" rounded="md" h="150px" />
              <Skeleton w="full" rounded="md" h="150px" />
              <Skeleton w="full" rounded="md" h="150px" />
              <Skeleton w="full" rounded="md" h="150px" />
            </Grid>
          ) : (
            <>
              {coupons?.length === 0 ? (
                <Flex justify={"center"} align="center" direction={"column"}>
                  <Icon as={GiCardboardBox} fontSize="4xl" />
                  <Text fontSize={"sm"}>Nenhuma informação para mostrar</Text>
                </Flex>
              ) : (
                <Grid
                  templateColumns={"repeat(auto-fit, minmax(310px, 310px))"}
                  gap={3}
                  justifyContent="center"
                >
                  {coupons?.map((coup) => (
                    <Box w="full" position={"relative"} key={coup.id}>
                      <svg
                        fill="transparent"
                        strokeWidth={"1px"}
                        stroke={useColorModeValue(
                          theme.colors.gray["900"],
                          theme.colors.gray["100"]
                        )}
                        width={"100%"}
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 282.5"
                      >
                        <path
                          d="M0,8.8l0,264.8c0,4.9,4,8.8,8.8,8.8h110.3c2.4,0,4.4-2,4.4-4.4v-4.4c0-10,8.4-18.1,18.5-17.6
            c9.5,0.4,16.8,8.6,16.8,18.1v3.9c0,2.4,2,4.4,4.4,4.4h339.9c4.9,0,8.8-4,8.8-8.8V8.8c0-4.9-4-8.8-8.8-8.8L163.3,0
            c-2.4,0-4.4,2-4.4,4.4v4.4c0,10-8.4,18.1-18.5,17.6c-9.5-0.4-16.8-8.6-16.8-18.1V4.4c0-2.4-2-4.4-4.4-4.4L8.8,0C4,0,0,4,0,8.8z
             M132.4,211.9c0-4.9,3.9-8.8,8.8-8.8c4.9,0,8.8,4,8.8,8.8v17.7c0,4.9-3.9,8.8-8.8,8.8c-4.9,0-8.8-4-8.8-8.8V211.9z M132.4,158.9
            c0-4.9,3.9-8.8,8.8-8.8c4.9,0,8.8,4,8.8,8.8v17.7c0,4.9-3.9,8.8-8.8,8.8c-4.9,0-8.8-4-8.8-8.8V158.9z M132.4,105.9
            c0-4.9,3.9-8.8,8.8-8.8c4.9,0,8.8,4,8.8,8.8v17.7c0,4.9-3.9,8.8-8.8,8.8c-4.9,0-8.8-4-8.8-8.8V105.9z M132.4,53
            c0-4.9,3.9-8.8,8.8-8.8c4.9,0,8.8,4,8.8,8.8v17.7c0,4.9-3.9,8.8-8.8,8.8c-4.9,0-8.8-4-8.8-8.8V53z"
                        />
                      </svg>
                      <Grid
                        position={"absolute"}
                        right={0}
                        left={0}
                        bottom={0}
                        top={0}
                        templateColumns={"1fr 3fr"}
                        gap={8}
                      >
                        <Flex
                          pl={2}
                          py={2}
                          justify="center"
                          align={"center"}
                          maxW="79px"
                        >
                          <Box
                            transform={"rotate(-90deg)"}
                            fontWeight="semibold"
                            fontSize={"lg"}
                            w="150px"
                          >
                            {coup.dicount}% OFF
                          </Box>
                        </Flex>
                        <Flex
                          pr={2}
                          py={2}
                          direction="column"
                          justify={"center"}
                        >
                          <Text fontSize={"2xl"} fontWeight="semibold">
                            {coup.coupon}
                          </Text>
                          <Tag w="fit-content">
                            {coup.period === "due_date" &&
                              `Expira em: ${format(
                                new Date(coup.expires_date),
                                "dd/MM/yyyy"
                              )}`}
                            {coup.period === "quantity" &&
                              `Restantes: ${coup.number_used}`}
                            {coup.period === "infinite" &&
                              "Sem data de validade"}
                          </Tag>
                          <Popover>
                            <PopoverTrigger>
                              <Button
                                leftIcon={<FaTrashAlt />}
                                colorScheme="red"
                                size="sm"
                                mt={5}
                              >
                                Excluir
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              shadow="lg"
                              _focus={{ outline: "none" }}
                            >
                              <PopoverArrow />
                              <PopoverHeader>Confirmação</PopoverHeader>
                              <PopoverCloseButton />
                              <PopoverBody>
                                Tem certeza que quer excluir este cupom?
                              </PopoverBody>
                              <PopoverFooter
                                display={"flex"}
                                justifyContent="end"
                              >
                                <Button
                                  colorScheme="blue"
                                  leftIcon={<AiOutlineCheck />}
                                  size="sm"
                                  isLoading={loadingDel}
                                  onClick={() => deleteCoupon(coup.id)}
                                >
                                  Sim
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>
                        </Flex>
                      </Grid>
                    </Box>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Box>
      </Box>
    </Fragment>
  );
}
