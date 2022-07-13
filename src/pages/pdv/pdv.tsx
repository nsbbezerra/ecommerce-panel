import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Kbd,
  Tooltip,
  Image,
  Tag,
} from "@chakra-ui/react";
import { Fragment } from "react";
import {
  AiOutlineBarcode,
  AiOutlineCheck,
  AiOutlineFilter,
  AiOutlineMail,
  AiOutlineMore,
  AiOutlinePercentage,
  AiOutlinePhone,
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { BsPrinter } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

export default function PDV() {
  const { colorMode } = useColorMode();
  const TableRow = () => (
    <Tr>
      <Td>
        <Avatar
          src="https://img.itdg.com.br/images/recipes/000/095/378/225012/225012_original.jpg"
          size="xs"
          zIndex={-1}
        />
      </Td>
      <Td>10</Td>
      <Td>Pizza Calabresa G</Td>
      <Td>R$ 40,00</Td>
      <Td>R$ 400,00</Td>
      <Td textAlign={"center"}>
        <HStack>
          <Tooltip label="Detalhes do Item" hasArrow>
            <IconButton
              aria-label="Detalhes"
              icon={<AiOutlineMore />}
              size="xs"
            />
          </Tooltip>

          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="remover item"
                icon={<FaTrashAlt />}
                colorScheme="red"
                size="xs"
                zIndex={0}
              />
            </PopoverTrigger>

            <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
              <PopoverArrow />
              <PopoverHeader textAlign={"justify"}>Confirmação</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody textAlign={"justify"}>
                Deseja excluir este item?
              </PopoverBody>
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
        </HStack>
      </Td>
    </Tr>
  );

  const ProductShow = () => (
    <Box
      rounded="md"
      overflow={"hidden"}
      borderWidth="1px"
      position={"relative"}
      h="fit-content"
    >
      <Image
        src="https://seuelias.com/v2018/wp-content/uploads/2021/12/seu-elias-leave-in-produto-300x300.png"
        w="100%"
      />
      <Box borderTopWidth={"1px"} p={2}>
        <Tooltip label="Barbeador Profissional para Barbas" hasArrow>
          <Text fontWeight={"semibold"} fontSize="sm" noOfLines={1}>
            Barbeador Profissional para Barbas
          </Text>
        </Tooltip>
        <Text fontSize={"xs"} fontWeight="thin" noOfLines={1}>
          Barbeiro
        </Text>
        <Grid templateColumns={"2fr 1fr"} mt={1} gap={2}>
          <Tag justifyContent={"center"} w="100%">
            R$ 40,00
          </Tag>
          <IconButton
            aria-label="Adicionar Produto"
            icon={<AiOutlineShopping />}
            size="xs"
            colorScheme={"blue"}
          />
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Fragment>
      <Box py={2} h="full" maxH={"full"} position="relative">
        <Grid
          templateColumns={"1fr 1fr"}
          gap={3}
          h={"55px"}
          position={"absolute"}
          top={2}
          right={0}
          left={0}
        >
          <HStack borderWidth="1px" rounded="md" px={2}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<AiOutlineUser />}
              />
              <Input placeholder="Cliente" />
            </InputGroup>
            <IconButton aria-label="Detalhes" icon={<AiOutlineMore />} />
            <Button colorScheme="blue" leftIcon={<AiOutlineSearch />} px={5}>
              Buscar
            </Button>
          </HStack>

          <HStack borderWidth="1px" rounded="md" px={2}>
            <InputGroup w="72">
              <Input placeholder="QTD" />
              <InputRightAddon px={2}>QTD</InputRightAddon>
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<AiOutlineBarcode />}
                zIndex={1}
              />
              <Input placeholder="Código de Barras" />
              <InputRightAddon px={2}>
                <Kbd colorScheme={"blue"}>F9</Kbd>
              </InputRightAddon>
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<BiRename />} />
              <Input placeholder="Nome" />
              <InputRightAddon px={2}>
                <Kbd colorScheme={"blue"}>F6</Kbd>
              </InputRightAddon>
            </InputGroup>
            <IconButton aria-label="Detalhes" icon={<AiOutlineFilter />} />
          </HStack>
        </Grid>

        <Box h="full" maxH="full" overflow={"hidden"} pt={"65px"}>
          <Grid templateColumns={"1fr 1fr"} gap={3} h="full" maxH={"full"}>
            <Grid
              templateRows={"1fr 120px"}
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
                    shadow={"md"}
                    zIndex={1}
                  >
                    <Tr>
                      <Th py={3} w="5%">
                        Thumb
                      </Th>
                      <Th w="3%">Qtd</Th>
                      <Th>Descrição</Th>
                      <Th>Unit</Th>
                      <Th>Total</Th>
                      <Th w="3%" textAlign={"center"}>
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
                  </Tbody>
                </Table>
              </Box>
              <Flex
                bg={useColorModeValue("white", "gray.800")}
                justify="space-between"
                align={"center"}
                direction="column"
                boxShadow={
                  colorMode === "light"
                    ? "0px -2px 6px rgba(0,0,0,.1)"
                    : "0px -2px 6px rgba(0,0,0,.3)"
                }
              >
                <Flex
                  justify={"space-between"}
                  w="full"
                  borderBottomWidth={"1px"}
                  px={5}
                  py={"7px"}
                >
                  <Text>SUB TOTAL</Text>
                  <Text>R$ 40,00</Text>
                </Flex>
                <Flex justify={"space-between"} w="full" px={5} py={1}>
                  <Text>DESCONTO</Text>
                  <Text>10%</Text>
                </Flex>
                <Flex
                  justify={"space-between"}
                  w="full"
                  fontSize={"lg"}
                  fontWeight="semibold"
                  bg={useColorModeValue("blue.500", "blue.300")}
                  color={useColorModeValue("white", "gray.800")}
                  px={5}
                  py={2}
                >
                  <Text>TOTAL A PAGAR</Text>
                  <Text>R$ 36,00</Text>
                </Flex>
              </Flex>
            </Grid>
            <Grid
              templateRows={"1fr 64px"}
              borderWidth="1px"
              overflow={"hidden"}
              rounded="md"
            >
              <Box maxH={"full"} h="full" overflow={"auto"} p={2}>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={2}>
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                  <ProductShow />
                </Grid>
              </Box>
              <Grid
                templateColumns="1fr 2fr 2fr"
                gap={2}
                px={2}
                alignItems="center"
                boxShadow={
                  colorMode === "light"
                    ? "0px -2px 6px rgba(0,0,0,.1)"
                    : "0px -2px 6px rgba(0,0,0,.3)"
                }
              >
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Oções"
                    icon={<AiOutlineTool />}
                    size="lg"
                  />
                  <MenuList>
                    <MenuItem icon={<AiOutlineSave />}>
                      Salvar como Orçamento
                    </MenuItem>
                    <MenuItem icon={<BsPrinter />}>Imprimir Venda</MenuItem>
                    <MenuItem
                      icon={<FaTrashAlt />}
                      color={useColorModeValue("red.600", "red.200")}
                    >
                      Cancelar Venda
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Button
                  size="lg"
                  leftIcon={<AiOutlinePercentage />}
                  colorScheme="blue"
                  variant="outline"
                >
                  Desconto
                </Button>
                <Button
                  size="lg"
                  leftIcon={<AiOutlineShoppingCart />}
                  colorScheme="blue"
                >
                  Finalizar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );
}
