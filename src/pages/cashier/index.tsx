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
  PopoverAnchor,
  ButtonGroup,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { forwardRef, Fragment, useRef, useState } from "react";
import { AiOutlineTool } from "react-icons/ai";
import { BiLineChart } from "react-icons/bi";
import { FaBoxOpen, FaCashRegister } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";

registerLocale("pt_br", pt_br);

export default function CashierIndex() {
  const [search, setSearch] = useState<string>("all");
  const inputref = useRef(null);
  const [saleDate, setSaleDate] = useState<Date>(new Date());

  const CustomInput = forwardRef((props: any, ref) => {
    return <Input {...props} ref={ref} size="lg" />;
  });

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
                    <Input type="number" />
                    <InputRightAddon children="R$" />
                  </InputGroup>
                </FormControl>
              </PopoverBody>
              <PopoverFooter display="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button colorScheme="blue" leftIcon={<FaBoxOpen />}>
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
              <option value="user">Usuário</option>
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
          {search === "user" && (
            <Input size={"lg"} placeholder="Digite um nome" />
          )}
          {search === "status" && (
            <Select placeholder="Selecione uma opção" size="lg">
              <option value={"open"}>Aberto</option>
              <option value={"closed"}>Fechado</option>
            </Select>
          )}
        </HStack>

        <Table size={"sm"} mt={5}>
          <Thead>
            <Tr>
              <Th>Usuário</Th>
              <Th>Data de Abertura</Th>
              <Th>Valor de Abertura</Th>
              <Th>Status</Th>
              <Th>Data de Fechamento</Th>
              <Th>Valor de Fechamento</Th>
              <Th w="10%" textAlign={"center"}>
                Opções
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td>10/10/1010</Td>
              <Td>R$ 100,00</Td>
              <Td>
                <Tag colorScheme={"green"}>Aberto</Tag>
              </Td>
              <Td>10/10/1010</Td>
              <Td>R$ 100,00</Td>
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
                    <MenuItem icon={<BiLineChart />}>Movimentar Caixa</MenuItem>
                    <MenuItem icon={<GiNotebook />}>Ver Movimentação</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Fragment>
  );
}
