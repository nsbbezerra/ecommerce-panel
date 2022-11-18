import { memo, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  RadioProps,
  useRadio,
  Box,
  useRadioGroup,
  HStack,
  useColorModeValue,
  Heading,
  Grid,
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  Input,
  InputRightAddon,
  Flex,
  Text,
  useToast,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { BiDollar } from "react-icons/bi";
import { api, configs } from "../configs";
import axios from "axios";

type OrderInfoProps = {
  id: string;
  value: string;
};

type LoadingProps = {
  mode: "find" | "create";
  isLoading: boolean;
};

type PayFormProps = {
  id: string;
  installments: number;
  is_installments: boolean;
  name: string;
  tag: string;
};

interface Props {
  isOpen: boolean;
  onSuccess: (data: boolean) => void;
  order: OrderInfoProps | null;
}

const PaymentModal = ({ isOpen, onSuccess, order }: Props) => {
  const toast = useToast();
  const [paymentInitialMode, setPaymentInitialMode] =
    useState<string>("checkout");
  const [loading, setLoading] = useState<LoadingProps>({
    mode: "find",
    isLoading: false,
  });

  const [payForms, setPayForms] = useState<PayFormProps[]>([]);

  const [firstPayForm, setFirstPayForm] = useState<PayFormProps | null>(null);
  const [secondPayForm, setSecondPayForm] = useState<PayFormProps | null>(null);
  const [firstPaymentValue, setFirstPaymentValue] = useState<number>(0);
  const [secondPaymentValue, setSecondPaymentValue] = useState<number>(0);
  const [firstInstallments, setFirstInstallments] = useState<string>("");
  const [secondInstallments, setSecondInstallments] = useState<string>("");

  useEffect(() => {
    setFirstPayForm(null);
    setSecondPayForm(null);
    setFirstPaymentValue(parseFloat(order?.value as string));
    setSecondPaymentValue(0);
    setFirstInstallments("");
    setSecondInstallments("");
  }, [paymentInitialMode]);

  useEffect(() => {
    if (firstPayForm && firstPayForm.installments < 1) {
      setFirstInstallments("");
    }
    if (secondPayForm && secondPayForm.installments < 1) {
      setSecondInstallments("");
    }
  }, [firstPayForm, secondPayForm]);

  useEffect(() => {
    if (order) {
      setFirstPaymentValue(parseFloat(order.value as string));
    } else {
      setFirstPaymentValue(0);
    }
  }, [order]);

  useEffect(() => {
    if (isNaN(firstPaymentValue)) {
      setSecondPaymentValue(parseFloat(order?.value as string));
    } else {
      if (firstPaymentValue > parseFloat(order?.value as string)) {
        setFirstPaymentValue(parseFloat(order?.value as string));
        setSecondPayForm(null);
        setSecondInstallments("");
      } else {
        const sum = parseFloat(order?.value as string) - firstPaymentValue;
        setSecondPaymentValue(parseFloat(sum.toFixed(2)));
      }
    }
  }, [firstPaymentValue]);

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

  async function FindPayForm() {
    setLoading({
      mode: "find",
      isLoading: true,
    });

    const company = localStorage.getItem("company");
    const companyParse = JSON.parse(company || "");

    try {
      const { data } = await api.get(`/pay_form_pay_order/${companyParse.id}`);
      setPayForms(data);
      setLoading({
        mode: "find",
        isLoading: false,
      });
    } catch (error) {
      setLoading({
        mode: "find",
        isLoading: false,
      });
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    if (isOpen === true) {
      FindPayForm();
    }
  }, [isOpen]);

  function RadioCard(props: RadioProps) {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: useColorModeValue("blue.500", "blue.300"),
            color: useColorModeValue("white", "gray.800"),
            borderColor: useColorModeValue("blue.500", "blue.300"),
          }}
          _focus={{
            boxShadow: "outline",
          }}
          px={5}
          py={2}
        >
          {props.children === "checkout"
            ? "Checkou Online"
            : "Pagamentos Internos"}
        </Box>
      </Box>
    );
  }
  function Example() {
    const options = ["checkout", "internal"];

    const { getRootProps, getRadioProps } = useRadioGroup({
      name: "pay_form",
      defaultValue: paymentInitialMode,
      onChange: (e) => setPaymentInitialMode(e),
    });

    const group = getRootProps();

    return (
      <HStack {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </HStack>
    );
  }

  function handlePayForm(mode: "first" | "second", id: string) {
    if (mode === "first") {
      const result = payForms.find((obj) => obj.id === id);
      setFirstPayForm(result || null);
    } else {
      const result = payForms.find((obj) => obj.id === id);
      setSecondPayForm(result || null);
    }
  }

  const HandleInstallmentsOptions = (count: number) => {
    switch (count) {
      case 1:
        return <option value={"1"}>1 Parcela</option>;

      case 2:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
          </optgroup>
        );

      case 3:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
          </optgroup>
        );

      case 4:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
          </optgroup>
        );

      case 5:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
          </optgroup>
        );

      case 6:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
          </optgroup>
        );

      case 7:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
            <option value={"7"}>7 Parcelas</option>
          </optgroup>
        );

      case 8:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
            <option value={"7"}>7 Parcelas</option>
            <option value={"8"}>8 Parcelas</option>
          </optgroup>
        );

      case 9:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
            <option value={"7"}>7 Parcelas</option>
            <option value={"8"}>8 Parcelas</option>
            <option value={"9"}>9 Parcelas</option>
          </optgroup>
        );

      case 10:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
            <option value={"7"}>7 Parcelas</option>
            <option value={"8"}>8 Parcelas</option>
            <option value={"9"}>9 Parcelas</option>
            <option value={"10"}>10 Parcelas</option>
          </optgroup>
        );

      case 11:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
            <option value={"7"}>7 Parcelas</option>
            <option value={"8"}>8 Parcelas</option>
            <option value={"9"}>9 Parcelas</option>
            <option value={"10"}>10 Parcelas</option>
            <option value={"11"}>11 Parcelas</option>
          </optgroup>
        );

      case 12:
        return (
          <optgroup label="Parcelas">
            <option value={"1"}>1 Parcela</option>
            <option value={"2"}>2 Parcelas</option>
            <option value={"3"}>3 Parcelas</option>
            <option value={"4"}>4 Parcelas</option>
            <option value={"5"}>5 Parcelas</option>
            <option value={"6"}>6 Parcelas</option>
            <option value={"7"}>7 Parcelas</option>
            <option value={"8"}>8 Parcelas</option>
            <option value={"9"}>9 Parcelas</option>
            <option value={"10"}>10 Parcelas</option>
            <option value={"11"}>11 Parcelas</option>
            <option value={"12"}>12 Parcelas</option>
          </optgroup>
        );

      default:
        return <option value={"1"}>1 Parcela</option>;
    }
  };

  const calcDivider = (value: number, divisor: number) => {
    const divide = value / divisor;
    return divide;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onSuccess(false)}
      size="4xl"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pagamento</ModalHeader>
        <ModalBody>
          <Example />
          {paymentInitialMode === "checkout" ? (
            <>
              <Heading mt={5} textAlign="center">
                Clique no botão abaixo para processar o pagamento
              </Heading>
            </>
          ) : (
            <>
              <Grid
                templateColumns={
                  firstPaymentValue === parseFloat(order?.value as string)
                    ? "repeat(1, 1fr)"
                    : "repeat(2, 1fr)"
                }
                rounded="md"
                borderWidth={"1px"}
                mt={3}
                p={3}
                gap={3}
              >
                <Box>
                  <Box
                    bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                    py={1}
                    px={4}
                    rounded="md"
                    textAlign="center"
                    mb={3}
                  >
                    PRIMEIRO MÉTODO
                  </Box>
                  <Grid templateColumns={"1fr 1fr"} gap={3}>
                    <FormControl>
                      <FormLabel>Forma de Pagamento</FormLabel>
                      <Select
                        placeholder="Selecione uma opção"
                        isDisabled={
                          loading.mode === "find" && loading.isLoading === true
                        }
                        value={firstPayForm ? firstPayForm.id : ""}
                        onChange={(e) => handlePayForm("first", e.target.value)}
                      >
                        {payForms.map((pay) => (
                          <option key={pay.id} value={pay.id}>
                            {pay.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Parcelas</FormLabel>
                      <Select
                        placeholder="Selecione uma opção"
                        isDisabled={
                          !firstPayForm
                            ? true
                            : firstPayForm.installments === 0
                            ? true
                            : false
                        }
                        value={firstInstallments}
                        onChange={(e) => setFirstInstallments(e.target.value)}
                      >
                        {HandleInstallmentsOptions(
                          firstPayForm ? firstPayForm.installments : 0
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <FormControl mt={2}>
                    <FormLabel>Valor</FormLabel>
                    <InputGroup>
                      <Input
                        value={firstPaymentValue}
                        onChange={(e) =>
                          setFirstPaymentValue(parseFloat(e.target.value))
                        }
                        type="number"
                      />
                      <InputRightAddon children="R$" />
                    </InputGroup>
                  </FormControl>
                </Box>
                {firstPaymentValue !== parseFloat(order?.value as string) && (
                  <Box>
                    <Box
                      bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                      py={1}
                      px={4}
                      rounded="md"
                      textAlign="center"
                      mb={3}
                    >
                      SEGUNDO MÉTODO
                    </Box>
                    <Grid templateColumns={"1fr 1fr"} gap={3}>
                      <FormControl>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <Select
                          placeholder="Selecione uma opção"
                          isDisabled={
                            loading.mode === "find" &&
                            loading.isLoading === true
                          }
                          value={secondPayForm ? secondPayForm.id : ""}
                          onChange={(e) =>
                            handlePayForm("second", e.target.value)
                          }
                        >
                          {payForms.map((pay) => (
                            <option key={pay.id} value={pay.id}>
                              {pay.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Parcelas</FormLabel>
                        <Select
                          placeholder="Selecione uma opção"
                          isDisabled={
                            !secondPayForm
                              ? true
                              : secondPayForm.installments === 0
                              ? true
                              : false
                          }
                          value={secondInstallments}
                          onChange={(e) =>
                            setSecondInstallments(e.target.value)
                          }
                        >
                          {HandleInstallmentsOptions(
                            secondPayForm ? secondPayForm.installments : 0
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <FormControl mt={2}>
                      <FormLabel>Valor</FormLabel>
                      <InputGroup>
                        <Input value={secondPaymentValue} isReadOnly />
                        <InputRightAddon children="R$" />
                      </InputGroup>
                    </FormControl>
                  </Box>
                )}
              </Grid>

              <Box
                bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                py={2}
                px={4}
                rounded="md"
                mt={5}
                fontSize="lg"
              >
                <Flex align={"center"} justify="space-between">
                  <Text>PRIMEIRO MÉTODO</Text>
                  <Text>
                    <strong>{firstPayForm ? firstPayForm.name : ""}</strong>{" "}
                    {firstPayForm
                      ? `${firstInstallments}${
                          parseInt(firstInstallments) > 0 ? "x" : ""
                        } - `
                      : ""}
                    {firstInstallments === ""
                      ? firstPaymentValue.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : calcDivider(
                          firstPaymentValue,
                          parseInt(firstInstallments)
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                  </Text>
                </Flex>
                {firstPaymentValue !== parseFloat(order?.value as string) && (
                  <Flex align={"center"} justify="space-between" mt={2}>
                    <Text>SEGUNDO MÉTODO</Text>
                    <Text>
                      <strong>{secondPayForm ? secondPayForm.name : ""}</strong>{" "}
                      {secondPayForm
                        ? `${secondInstallments}${
                            parseInt(secondInstallments) > 0 ? "x" : ""
                          } - `
                        : ""}
                      {secondInstallments === ""
                        ? secondPaymentValue.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : calcDivider(
                            secondPaymentValue,
                            parseInt(secondInstallments)
                          ).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                    </Text>
                  </Flex>
                )}
                <Flex
                  align={"center"}
                  justify="space-between"
                  mt={2}
                  fontWeight="bold"
                >
                  <Text>TOTAL A PAGAR</Text>
                  <Text>
                    {parseFloat(order?.value as string).toLocaleString(
                      "pt-br",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </Text>
                </Flex>
              </Box>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={() => {}} leftIcon={<BiDollar />}>
            Gerar Pagamento
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(PaymentModal);
