import {
  Box,
  Container,
  Flex,
  Grid,
  HStack,
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

export default function Layout() {
  return (
    <Fragment>
      <Grid
        w={"100vw"}
        h="100vh"
        maxW={"100vw"}
        maxH="100vh"
        templateRows={"60px 1fr 35px"}
      >
        <Header />
        <Box w="100%" h="100%" overflow="auto" pt={1} pb={1}>
          <Scrollbars autoHide>
            <Container maxW={"8xl"}>
              <Routing />
            </Container>
          </Scrollbars>
        </Box>
        <Box
          h="100%"
          borderTopWidth={"1px"}
          boxShadow="0px -3px 5px rgba(0,0,0,.08)"
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
                <IconButton
                  aria-label="Facebook"
                  icon={<AiOutlineFacebook />}
                  size="xs"
                  colorScheme={"facebook"}
                />
                <IconButton
                  aria-label="Instagram"
                  icon={<AiOutlineInstagram />}
                  size="xs"
                  colorScheme={"purple"}
                />
                <IconButton
                  aria-label="Whatsapp"
                  icon={<AiOutlineWhatsApp />}
                  size="xs"
                  colorScheme={"whatsapp"}
                />
                <IconButton
                  aria-label="Twitter"
                  icon={<AiOutlineTwitter />}
                  size="xs"
                  colorScheme={"twitter"}
                />
                <IconButton
                  aria-label="Telegram"
                  icon={<FaTelegramPlane />}
                  size="xs"
                  colorScheme={"telegram"}
                />
                <IconButton
                  aria-label="Linkedin"
                  icon={<AiOutlineLinkedin />}
                  size="xs"
                  colorScheme={"linkedin"}
                />
              </HStack>
            </Flex>
          </Container>
        </Box>
      </Grid>
    </Fragment>
  );
}
