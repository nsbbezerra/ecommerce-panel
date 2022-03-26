import { Box, Grid, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import Header from "./header";

import logo from "../assets/logo.svg";
import Scrollbars from "react-custom-scrollbars";

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
        <Box w="100%" h="100%" overflow="auto">
          <Scrollbars>
            <Text h={1360}>adhjaskdjahskh</Text>
          </Scrollbars>
        </Box>
      </Grid>
    </Fragment>
  );
}
