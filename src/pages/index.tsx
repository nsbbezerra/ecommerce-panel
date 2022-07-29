import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineTwitter,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";

import logo from "../assets/logo.svg";
import anyDesk from "../assets/any.svg";

export default function Index() {
  return (
    <Flex
      justify={"center"}
      align="center"
      py={10}
      direction="column"
      gap={1}
      h={"100%"}
    >
      <Image src={logo} w="20%" draggable={false} />
      <Heading fontWeight={"semibold"} mt={5}>
        Gestão de Ecommerce
      </Heading>
      <Text>© NK Informática - Natanael Bezerra</Text>
      <Text>Rua 34, Qd 15 Lt 14, 173, CEP: 77710-000, Pedro Afonso - TO</Text>
      <HStack mt={5} spacing={3}>
        <IconButton aria-label="Facebook" icon={<AiOutlineFacebook />} />
        <IconButton aria-label="Instagram" icon={<AiOutlineInstagram />} />
        <IconButton aria-label="Whatsapp" icon={<AiOutlineWhatsApp />} />
        <IconButton aria-label="Twitter" icon={<AiOutlineTwitter />} />
        <IconButton aria-label="Telegram" icon={<FaTelegramPlane />} />
        <IconButton aria-label="Linkedin" icon={<AiOutlineLinkedin />} />
      </HStack>

      <Text mt={5}>Suporte Remoto:</Text>
      <a href={"https://anydesk.com/pt"} target="_blank">
        <Flex
          rounded={"full"}
          borderWidth="1px"
          borderColor={useColorModeValue("red.500", "red.200")}
          align="center"
          px={5}
          py={1}
          gap={3}
          _hover={{ bg: useColorModeValue("red.50", "red.800") }}
          cursor="pointer"
        >
          <Image src={anyDesk} w="50px" />
          <Heading
            color={useColorModeValue("red.500", "red.200")}
            fontSize="2xl"
          >
            AnyDesk
          </Heading>
        </Flex>
      </a>
    </Flex>
  );
}
