import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Fragment } from "react";
import {
  AiOutlineCheck,
  AiOutlineMail,
  AiOutlinePercentage,
  AiOutlinePhone,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { BsPrinter } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

export default function PDV() {
  const { colorMode } = useColorMode();
  const TableRow = () => (
    <Tr>
      <Td>
        <Avatar
          src="https://img.itdg.com.br/images/recipes/000/095/378/225012/225012_original.jpg"
          size="sm"
          zIndex={-1}
        />
      </Td>
      <Td>10</Td>
      <Td>Pizza Calabresa G</Td>
      <Td>R$ 40,00</Td>
      <Td>R$ 400,00</Td>
      <Td>
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label="remover item"
              icon={<FaTrashAlt />}
              colorScheme="red"
              size="sm"
              zIndex={-1}
            />
          </PopoverTrigger>

          <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
            <PopoverArrow />
            <PopoverHeader>Confirmação</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>Deseja excluir este item?</PopoverBody>
            <PopoverFooter display="flex" justifyContent={"end"}>
              <Button
                leftIcon={<AiOutlineCheck />}
                colorScheme="blue"
                size="sm"
              >
                Sim
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Td>
    </Tr>
  );

  const TableRowProduct = () => (
    <Tr>
      <Td>Bebidas</Td>
      <Td>Água 300 ml</Td>
      <Td w="15%" textAlign="center">
        <IconButton
          aria-label="adicionar item"
          icon={<AiOutlinePlus />}
          size="xs"
          colorScheme={"blue"}
        />
      </Td>
    </Tr>
  );

  return (
    <Fragment>
      <Box py={2} h="full" maxH={"full"}>
        <Box h="full" maxH="full" overflow={"hidden"}>
          <Grid templateColumns={"1fr 1fr"} gap={3} h="full" maxH={"full"}>
            <Grid
              templateRows={"3fr 1fr"}
              borderWidth="1px"
              overflow={"hidden"}
              rounded="md"
            >
              <Box maxH={"full"} h="full" overflow={"auto"}>
                <Table size="sm">
                  <Thead
                    position="sticky"
                    top={0}
                    bg={useColorModeValue("white", "gray.800")}
                    shadow={colorMode === "light" ? "sm" : "md"}
                  >
                    <Tr>
                      <Th py={4} borderBottomWidth="1px">
                        Thumb
                      </Th>
                      <Th>Qtd</Th>
                      <Th>Descrição</Th>
                      <Th>V. Unit</Th>
                      <Th>V. Total</Th>
                      <Th>Opções</Th>
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
                  </Tbody>
                </Table>
              </Box>
              <Flex
                bg={useColorModeValue("blackAlpha.50", "whiteAlpha.200")}
                justify="center"
                align={"center"}
                direction="column"
                gap={1}
                boxShadow="0px -2px 5px rgba(0,0,0,.08)"
              >
                <Flex
                  justify={"space-between"}
                  w="full"
                  borderBottomWidth={"1px"}
                  px={5}
                  py={1}
                >
                  <Text>SUB TOTAL</Text>
                  <Text>R$ 40,00</Text>
                </Flex>
                <Flex
                  justify={"space-between"}
                  w="full"
                  borderBottomWidth={"1px"}
                  px={5}
                  py={1}
                >
                  <Text>DESCONTO</Text>
                  <Text>10%</Text>
                </Flex>
                <Flex
                  justify={"space-between"}
                  w="full"
                  fontSize={"xl"}
                  fontWeight="semibold"
                  color={useColorModeValue("blue.500", "blue.200")}
                  px={5}
                  pt={1}
                >
                  <Text>TOTAL A PAGAR</Text>
                  <Text>R$ 36,00</Text>
                </Flex>
              </Flex>
            </Grid>
            <Grid templateColumns={"1fr 1fr"} gap={3} h="full" maxH={"full"}>
              <Grid templateRows={"1fr 1fr"} gap={3}>
                <Box
                  rounded={"md"}
                  borderWidth="1px"
                  py={3}
                  px={2}
                  position="relative"
                >
                  <Flex align="center" gap={3}>
                    <Avatar size={"md"} icon={<AiOutlineUser />} />
                    <Stack spacing={-1}>
                      <Text
                        color={useColorModeValue("blue.500", "blue.200")}
                        fontWeight="semibold"
                        fontSize={"lg"}
                      >
                        Natanael dos Santos Bezerra
                      </Text>
                      <Text fontSize={"sm"}>10293-1293808798123-87987</Text>
                    </Stack>
                  </Flex>
                  <Stack spacing={0} mt={3}>
                    <Flex
                      justify={"space-between"}
                      fontSize="sm"
                      mb={2}
                      color={useColorModeValue("blue.500", "blue.200")}
                    >
                      <HStack>
                        <Icon as={AiOutlinePhone} />
                        <Text>(63) 99971-1716</Text>
                      </HStack>
                      <HStack>
                        <Icon as={AiOutlineMail} />
                        <Text>contato.nk.info@gmail.com</Text>
                      </HStack>
                    </Flex>
                    <Text fontSize={"sm"}>
                      Rua 34, Qd 15 Lt 14, Canavieiras
                    </Text>
                    <Text fontSize={"sm"}>Pedro Afonso - TO</Text>
                    <Text fontSize={"sm"}>77710-000</Text>
                  </Stack>

                  <Button
                    leftIcon={<AiOutlineSearch />}
                    size="lg"
                    position={"absolute"}
                    bottom={2}
                    right={2}
                    left={2}
                    colorScheme="blue"
                  >
                    Buscar Cliente
                  </Button>
                </Box>
                <Box rounded={"md"} borderWidth="1px" p={2}>
                  <Grid templateRows={"1fr 1fr 2fr"} h="full">
                    <Button
                      leftIcon={<AiOutlinePercentage />}
                      size="lg"
                      isFullWidth
                      h="full"
                    >
                      Adicionar Desconto
                    </Button>

                    <Grid
                      templateColumns={"1fr 1fr"}
                      gap={3}
                      mt={3}
                      h="full"
                      pb={3}
                    >
                      <Button leftIcon={<BsPrinter />} size="lg" h="full">
                        Imprimir
                      </Button>
                      <Button
                        leftIcon={<FaTrashAlt />}
                        size="lg"
                        colorScheme={"red"}
                        h="full"
                      >
                        Cancelar
                      </Button>
                    </Grid>

                    <Box pt={3}>
                      <Button
                        leftIcon={<AiOutlineCheck />}
                        isFullWidth
                        size="lg"
                        colorScheme={"green"}
                        h="full"
                      >
                        Finalizar Venda
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
              <Box rounded={"md"} borderWidth="1px" maxH="full" h="full"></Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );
}
