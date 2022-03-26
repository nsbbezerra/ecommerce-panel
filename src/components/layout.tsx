import { Box, Container, Grid, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import Header from "./header";

import logo from "../assets/logo.svg";
import Scrollbars from "react-custom-scrollbars";
import Routing from "../routes";

export default function Layout() {
  return (
    <Fragment>
      <Grid
        w={"100vw"}
        h="100vh"
        maxW={"100vw"}
        maxH="100vh"
        templateRows={"60px 1fr"}
      >
        <Header />
        <Box w="100%" h="100%" overflow="auto" py={5}>
          <Scrollbars>
            <Container maxW={"8xl"}>
              <Routing />
            </Container>
          </Scrollbars>
        </Box>
      </Grid>
    </Fragment>
  );
}
