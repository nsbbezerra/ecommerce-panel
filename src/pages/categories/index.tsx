import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { AiOutlineOrderedList, AiOutlineSave } from "react-icons/ai";

import Register from "./register";
import List from "./list";

const IndexCategories = () => {
  const [index, setIndex] = useState<number>(0);

  return (
    <Fragment>
      <Box py={3}>
        <Box>
          <Tabs
            variant={"enclosed-colored"}
            onChange={(e) => setIndex(e)}
            index={index}
            mb={-3}
          >
            <TabList>
              <Tab roundedTop={"md"}>
                <Icon as={AiOutlineOrderedList} mr={2} />
                Listagem
              </Tab>
              <Tab roundedTop={"md"}>
                <Icon as={AiOutlineSave} mr={2} />
                Cadastro
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>{index === 0 && <List />}</TabPanel>
              <TabPanel px={0}>{index === 1 && <Register />}</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Fragment>
  );
};

export default IndexCategories;
