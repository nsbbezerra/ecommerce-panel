import { memo, useState } from "react";
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
} from "@chakra-ui/react";
import { BiDollar } from "react-icons/bi";

interface Props {
  isOpen: boolean;
  onSuccess: (data: boolean) => void;
  order: string;
}

const PaymentModal = ({ isOpen, onSuccess, order }: Props) => {
  const [paymentInitialMode, setPaymentInitialMode] =
    useState<string>("checkout");

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

  return (
    <Modal isOpen={isOpen} onClose={() => onSuccess(false)} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pagamento</ModalHeader>
        <ModalCloseButton />
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
                templateColumns={"repeat(2, 1fr)"}
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
                      <Select placeholder="Selecione uma opção">
                        <option>Dinheiro</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Parcelas</FormLabel>
                      <Select placeholder="Selecione uma opção">
                        <option>Dinheiro</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <FormControl mt={2}>
                    <FormLabel>Valor</FormLabel>
                    <InputGroup>
                      <Input />
                      <InputRightAddon children="R$" />
                    </InputGroup>
                  </FormControl>
                </Box>
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
                      <Select placeholder="Selecione uma opção">
                        <option>Dinheiro</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Parcelas</FormLabel>
                      <Select placeholder="Selecione uma opção">
                        <option>Dinheiro</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <FormControl mt={2}>
                    <FormLabel>Valor</FormLabel>
                    <InputGroup>
                      <Input />
                      <InputRightAddon children="R$" />
                    </InputGroup>
                  </FormControl>
                </Box>
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
                    <strong>Boleto</strong> 2x - R$400,00
                  </Text>
                </Flex>
                <Flex align={"center"} justify="space-between" mt={2}>
                  <Text>SEGUNDO MÉTODO</Text>
                  <Text>
                    <strong>Boleto</strong> 2x - R$400,00
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
