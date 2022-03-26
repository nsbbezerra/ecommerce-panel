import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorMode,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Switch,
} from "@chakra-ui/react";
import { Fragment, useRef, useState } from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineAreaChart,
  AiOutlineCheck,
  AiOutlineClose,
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
  const btnRef = useRef(null);
  const cancelRef = useRef(null);
  const { toggleColorMode, colorMode } = useColorMode();
  const [drawer, setDrawer] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

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
                onClick={() => setDrawer(true)}
              />
            </Tooltip>
            <Tooltip hasArrow label="Logout">
              <IconButton
                aria-label="Sair do aplicativo"
                icon={<AiOutlineLogout />}
                colorScheme="red"
                onClick={() => setAlert(true)}
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Box>

      <Drawer
        isOpen={drawer}
        placement="right"
        onClose={() => setDrawer(false)}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Configurações Gerais</DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <Grid templateColumns={"1fr 1fr"} gap={3}>
                <FormControl>
                  <FormLabel>Máximo de Parcelas com Boleto</FormLabel>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormLabel>Máximo de Parcelas com Cartões</FormLabel>
                  <Input />
                </FormControl>
              </Grid>
              <Grid templateColumns={"1fr 1fr"} gap={3}>
                <FormControl>
                  <FormLabel>Valor Mínimo para Parcelar com Boleto</FormLabel>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormLabel>Valor Mínimo para Parcelar com Cartões</FormLabel>
                  <Input />
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Chave API de Pagamentos</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Chave API de Notas Fiscais</FormLabel>
                <Input />
              </FormControl>
              <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                <FormControl>
                  <FormLabel>Emite Notas Fiscais?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Boleto?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Cartões de Crédito?</FormLabel>
                  <Switch />
                </FormControl>
              </Grid>
              <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                <FormControl>
                  <FormLabel>Aceita PIX?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Pagamento Digital?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Cripto Moedas?</FormLabel>
                  <Switch />
                </FormControl>
              </Grid>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              mr={3}
              onClick={() => setDrawer(false)}
              leftIcon={<AiOutlineClose />}
            >
              Cancelar
            </Button>
            <Button colorScheme="blue" leftIcon={<AiOutlineSave />}>
              Salvar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={alert}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlert(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout
            </AlertDialogHeader>

            <AlertDialogBody>Deseja realmente sair?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setAlert(false)}
                leftIcon={<AiOutlineClose />}
              >
                Não
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => setAlert(false)}
                ml={3}
                leftIcon={<AiOutlineCheck />}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Fragment>
  );
}
