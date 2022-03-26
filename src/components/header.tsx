import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { Fragment } from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineAreaChart,
  AiOutlineFall,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineImport,
  AiOutlineLogout,
  AiOutlinePercentage,
  AiOutlinePicture,
  AiOutlineProfile,
  AiOutlineRise,
  AiOutlineSave,
  AiOutlineShop,
  AiOutlineShopping,
  AiOutlineTag,
  AiOutlineTags,
  AiOutlineTool,
  AiOutlineUnorderedList,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaRegSun, FaRegMoon } from "react-icons/fa";

import logo from "../assets/logo.svg";

export default function Header() {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Fragment>
      <Box h="60px" w={"100%"} shadow="md" borderBottomWidth={"1px"}>
        <Flex align={"center"} justify="space-between" h="100%" px={7}>
          <HStack>
            <Image src={logo} h="40px" />

            <Box h="45px" borderRightWidth={"1px"} px={1} />

            <HStack pl={3}>
              <Button
                leftIcon={<AiOutlineHome />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Início
              </Button>
              <Button
                leftIcon={<AiOutlineShop />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Empresa
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  leftIcon={<AiOutlineUsergroupAdd />}
                  colorScheme="blue"
                  variant={"ghost"}
                  size="sm"
                >
                  Colaboradores
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<AiOutlineSave />}>Cadastro</MenuItem>
                  <MenuItem icon={<AiOutlineTool />}>Gerenciar</MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<AiOutlineUser />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Clientes
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  leftIcon={<AiOutlineTags />}
                  colorScheme="blue"
                  variant={"ghost"}
                  size="sm"
                >
                  Produtos
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<AiOutlineUnorderedList />}>
                    Listagem
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<AiOutlineTag />}>Categorias</MenuItem>
                  <MenuItem icon={<AiOutlineTags />}>Sub-Categorias</MenuItem>
                  <MenuItem icon={<AiOutlinePicture />}>Imagens</MenuItem>
                  <MenuItem icon={<AiOutlineTags />}>Tags</MenuItem>
                  <MenuItem icon={<AiOutlineAppstoreAdd />}>
                    Itens Adicionais
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<AiOutlineImport />}>Importar XML</MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<AiOutlineShopping />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Vendas
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  leftIcon={<AiOutlineAreaChart />}
                  colorScheme="blue"
                  variant={"ghost"}
                  size="sm"
                >
                  Financeiro
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<AiOutlineRise />}>Receitas</MenuItem>
                  <MenuItem icon={<AiOutlineFall />}>Despesas</MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<AiOutlinePercentage />}>Promoções</MenuItem>
                  <MenuItem icon={<AiOutlineProfile />}>
                    Cupons de Desconto
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<AiOutlineFileText />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Notas Ficais
              </Button>
            </HStack>
          </HStack>

          <HStack>
            <Tooltip hasArrow label="Alterar o tema">
              <IconButton
                aria-label="Alterar o tema do aplicativo"
                icon={colorMode === "light" ? <FaRegMoon /> : <FaRegSun />}
                onClick={toggleColorMode}
              />
            </Tooltip>
            <Tooltip hasArrow label="Configurações">
              <IconButton
                aria-label="Abrir configurações gerais"
                icon={<AiOutlineTool />}
              />
            </Tooltip>
            <Tooltip hasArrow label="Logout">
              <IconButton
                aria-label="Sair do aplicativo"
                icon={<AiOutlineLogout />}
                colorScheme="red"
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Box>
    </Fragment>
  );
}
