import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";
import Header from "./header";

import Scrollbars from "react-custom-scrollbars";
import Routing from "../routes";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineTwitter,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { BiMobileVibration } from "react-icons/bi";
import { version } from "../../package.json";

export default function Layout() {
  return (
    <Fragment>
      <Flex
        h="100vh"
        w="100vw"
        justify={"center"}
        align="center"
        display={["flex", "flex", "flex", "none", "none"]}
        direction="column"
        gap={5}
      >
        <Icon as={BiMobileVibration} fontSize="8xl" />
        <Heading fontSize={"2xl"} textAlign="center">
          Este App não está configurado para versões Mobile
        </Heading>
        <Text>Aguarde as próximas versões</Text>
      </Flex>
      <Grid
        w={"100vw"}
        h="100vh"
        maxW={"100vw"}
        maxH="100vh"
        templateRows={"60px 1fr 35px"}
        display={["none", "none", "none", "grid", "grid"]}
      >
        <Header />
        <Box w="100%" h="100%" overflow="auto" pt={1} pb={1}>
          <Scrollbars autoHide>
            <Container maxW={"8xl"} h="100%">
              <Routing />
            </Container>
          </Scrollbars>
        </Box>
        <Box
          h="100%"
          borderTopWidth={"1px"}
          boxShadow="0px -1px 3px rgba(0,0,0,.08)"
        >
          <Container maxW={"8xl"} h="100%">
            <Flex h="100%" justify={"space-between"} align="center">
              <Text
                fontSize={"xs"}
                d={["none", "none", "block", "block", "block"]}
              >
                Sistema desenvolvido por:{" "}
                <Link fontWeight={"semibold"}>NK Informática</Link>,
                desenvolvedor responsável: <strong>Natanael Bezerra</strong>
              </Text>
              <HStack>
                <Text fontSize={"sm"} mr={10}>
                  Versão: {version}
                </Text>
                <IconButton
                  aria-label="Facebook"
                  icon={<AiOutlineFacebook />}
                  size="xs"
                />
                <IconButton
                  aria-label="Instagram"
                  icon={<AiOutlineInstagram />}
                  size="xs"
                />
                <IconButton
                  aria-label="Whatsapp"
                  icon={<AiOutlineWhatsApp />}
                  size="xs"
                />
                <IconButton
                  aria-label="Twitter"
                  icon={<AiOutlineTwitter />}
                  size="xs"
                />
                <IconButton
                  aria-label="Telegram"
                  icon={<FaTelegramPlane />}
                  size="xs"
                />
                <IconButton
                  aria-label="Linkedin"
                  icon={<AiOutlineLinkedin />}
                  size="xs"
                />
              </HStack>
            </Flex>
          </Container>
        </Box>
      </Grid>
    </Fragment>
  );
}
