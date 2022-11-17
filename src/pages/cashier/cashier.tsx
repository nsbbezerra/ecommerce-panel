import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Progress,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useColorModeValue,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  InputGroup,
  Input,
  InputRightAddon,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { AiOutlineSave, AiOutlineTool } from "react-icons/ai";
import { BiCheck, BiDollar, BiPrinter, BiTrash } from "react-icons/bi";
import { FaCalculator, FaChartArea, FaSearchPlus } from "react-icons/fa";

export default function Cashier() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [modalMoviment, setModalMoviment] = useState<boolean>(false);

  const TableRow = () => (
    <Tr>
      <Td textAlign={"center"}>1</Td>
      <Td>Natanael dos Santos Bezerra</Td>
      <Td>10/10/1010</Td>
      <Td isNumeric>R$ 4000,00</Td>
      <Td textAlign={"center"}>
        <Button size={"xs"} isFullWidth leftIcon={<FaSearchPlus />}>
          Mostrar
        </Button>
      </Td>
      <Td textAlign={"center"}>
        <Button size={"xs"} isFullWidth leftIcon={<FaSearchPlus />}>
          Mostrar
        </Button>
      </Td>
      <Td textAlign={"center"}>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AiOutlineTool />}
            colorScheme="blue"
            size="xs"
            isFullWidth
          >
            Opções
          </MenuButton>
          <MenuList>
            <MenuItem icon={<BiPrinter />}>Imprimir</MenuItem>
            <MenuItem icon={<BiDollar />}>Alterar Pagamentos</MenuItem>
            <MenuItem icon={<BiTrash />}>Cancelar Compra</MenuItem>
            <MenuItem icon={<BiCheck />}>Concluir Compra</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );

  return (
    <Fragment>
      <Box py={3} h="100%" maxH={"100vh"}>
        <Grid templateRows={"1fr"} gap={5}>
          <Grid templateColumns={"250px 1fr"} gap={5} pb={2}>
            <Box
              borderWidth={"1px"}
              p={3}
              rounded="md"
              shadow="md"
              h="fit-content"
            >
              <Grid
                templateRows={"repeat(2, 1fr)"}
                gap={2}
                alignItems={"center"}
              >
                <Button
                  leftIcon={<FaChartArea />}
                  onClick={() => setModalMoviment(true)}
                >
                  Movimentações
                </Button>

                <Popover isOpen={isOpen} onClose={onClose} placement="right">
                  <PopoverTrigger>
                    <Button
                      colorScheme={"blue"}
                      leftIcon={<FaCalculator />}
                      onClick={onToggle}
                    >
                      Fechar o Caixa
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent _focus={{ outline: "none" }} shadow="lg">
                    <PopoverHeader fontWeight="semibold">
                      Confirmação
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>Deseja realmente fechar o caixa?</PopoverBody>
                    <PopoverFooter display="flex" justifyContent="flex-end">
                      <ButtonGroup size="sm">
                        <Button variant="outline" onClick={onClose}>
                          Não
                        </Button>
                        <Button colorScheme="blue">Sim</Button>
                      </ButtonGroup>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Grid>
              <Divider mt={3} mb={3} />
              <Stack spacing={1} mb={5}>
                <FormControl>
                  <FormLabel fontSize={"sm"} fontWeight="normal">
                    Dinheiro
                  </FormLabel>
                  <Progress value={45} hasStripe rounded={"md"} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"} fontWeight="normal">
                    Cartão de Crédito
                  </FormLabel>
                  <Progress value={22} hasStripe rounded={"md"} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"} fontWeight="normal">
                    Cartão de Débito
                  </FormLabel>
                  <Progress value={47} hasStripe rounded={"md"} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"} fontWeight="normal">
                    Boleto
                  </FormLabel>
                  <Progress value={22} hasStripe rounded={"md"} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"} fontWeight="normal">
                    PIX
                  </FormLabel>
                  <Progress value={77} hasStripe rounded={"md"} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"} fontWeight="normal">
                    Checkout Online
                  </FormLabel>
                  <Progress value={55} hasStripe rounded={"md"} />
                </FormControl>
              </Stack>
              <Flex justify={"space-between"}>
                <Stat color={useColorModeValue("red.500", "red.300")}>
                  <StatLabel>Saques</StatLabel>
                  <StatNumber>£0.00</StatNumber>
                </Stat>
                <Stat color={useColorModeValue("green.500", "green.300")}>
                  <StatLabel>Depósitos</StatLabel>
                  <StatNumber>£0.00</StatNumber>
                </Stat>
              </Flex>
              <Flex justify={"space-between"} mt={2}>
                <Stat>
                  <StatLabel>Total Movimentado</StatLabel>
                  <StatNumber>£0.00</StatNumber>
                </Stat>
              </Flex>
            </Box>
            <Box rounded={"md"} shadow="md" borderWidth={"1px"}>
              <Table size="sm">
                <Thead
                  position="sticky"
                  top={0}
                  bg={useColorModeValue("gray.50", "gray.900")}
                  shadow={"sm"}
                  zIndex={1}
                >
                  <Tr>
                    <Th py={2} w="1%" textAlign={"center"}>
                      Nº
                    </Th>
                    <Th>CLIENTE</Th>
                    <Th>Data</Th>
                    <Th isNumeric>Valor</Th>
                    <Th textAlign={"center"}>Itens</Th>
                    <Th textAlign={"center"}>Pagamento</Th>
                    <Th textAlign={"center"} w="12%">
                      Opções
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                  <TableRow />
                </Tbody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Modal isOpen={modalMoviment} onClose={() => setModalMoviment(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Movimentações do Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={"1fr 1fr"} gap={3}>
              <FormControl>
                <FormLabel>Tipo</FormLabel>
                <Select placeholder="Selecione uma opção" autoFocus>
                  <option>Deposito</option>
                  <option>Saque</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Valor</FormLabel>
                <InputGroup>
                  <Input />
                  <InputRightAddon children="R$" />
                </InputGroup>
              </FormControl>
            </Grid>
            <FormControl mt={3}>
              <FormLabel>Descrição</FormLabel>
              <Textarea rows={5} resize="none" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"blue"} leftIcon={<AiOutlineSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
