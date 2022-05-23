import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  theme,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Fragment } from "react";
import {
  AiOutlineShopping,
  AiOutlineTags,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Index() {
  const data = [
    {
      name: "Page A",
      despesas: 4000,
      receitas: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      despesas: 3000,
      receitas: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      despesas: 2000,
      receitas: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      despesas: 2780,
      receitas: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      despesas: 1890,
      receitas: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      despesas: 2390,
      receitas: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      despesas: 3490,
      receitas: 4300,
      amt: 2100,
    },
  ];

  return (
    <Fragment>
      <Box py={3}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(4, 1fr)",
            "repeat(4, 1fr)",
          ]}
          gap={5}
        >
          <Flex
            align={"center"}
            borderWidth="1px"
            shadow={"md"}
            rounded="md"
            p={2}
          >
            <Icon as={AiOutlineUser} fontSize="4xl" mx={3} />
            <Stat ml={3}>
              <StatLabel>Clientes Cadastrados</StatLabel>
              <StatNumber>1000</StatNumber>
            </Stat>
          </Flex>
          <Flex
            align={"center"}
            borderWidth="1px"
            shadow={"md"}
            rounded="md"
            p={2}
          >
            <Icon as={AiOutlineUsergroupAdd} fontSize="4xl" mx={3} />
            <Stat ml={3}>
              <StatLabel>Funcionários Ativos</StatLabel>
              <StatNumber>1000</StatNumber>
            </Stat>
          </Flex>
          <Flex
            align={"center"}
            borderWidth="1px"
            shadow={"md"}
            rounded="md"
            p={2}
          >
            <Icon as={AiOutlineTags} fontSize="4xl" mx={3} />
            <Stat ml={3}>
              <StatLabel>Produtos Ativos</StatLabel>
              <StatNumber>1000</StatNumber>
            </Stat>
          </Flex>
          <Flex
            align={"center"}
            borderWidth="1px"
            shadow={"md"}
            rounded="md"
            p={2}
          >
            <Icon as={AiOutlineShopping} fontSize="4xl" mx={3} />
            <Stat ml={3}>
              <StatLabel>Vendas Realizadas</StatLabel>
              <StatNumber>1000</StatNumber>
            </Stat>
          </Flex>
        </Grid>

        <Grid
          templateColumns={[
            "1fr",
            "1fr",
            "1fr 1fr",
            "250px 1fr 1fr",
            "250px 1fr 1fr",
          ]}
          gap={5}
          borderWidth="1px"
          rounded="md"
          shadow={"md"}
          p={3}
          mt={5}
        >
          <Box w="250px" h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="0" />
                <XAxis dataKey="name" fontSize={theme.fontSizes.xs} />
                <YAxis fontSize={theme.fontSizes.xs} />
                <Tooltip
                  contentStyle={{
                    background: useColorModeValue(
                      "white",
                      theme.colors.gray["900"]
                    ),
                    borderRadius: theme.radii.md,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="despesas"
                  fill={useColorModeValue(
                    theme.colors.red["600"],
                    theme.colors.red["300"]
                  )}
                />
                <Bar
                  dataKey="receitas"
                  fill={useColorModeValue(
                    theme.colors.green["600"],
                    theme.colors.green["300"]
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box>
            <Table size={"sm"} variant="striped" colorScheme={"green"}>
              <TableCaption>
                Receitas para Hoje{" "}
                <Button size="xs" ml={2} colorScheme="blue">
                  Veja Mais
                </Button>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>DESCRIÇÃO</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          <Box>
            <Table size={"sm"} variant="striped" colorScheme={"red"}>
              <TableCaption>
                Despesas para Hoje{" "}
                <Button size="xs" ml={2} colorScheme="blue">
                  Veja Mais
                </Button>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>DESCRIÇÃO</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Grid>

        <Grid
          templateColumns={[
            "1fr",
            "1fr",
            "250px 1fr",
            "250px 1fr",
            "250px 1fr",
          ]}
          gap={5}
          borderWidth="1px"
          rounded="md"
          shadow={"md"}
          p={3}
          mt={5}
        >
          <Box w="250px" h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="0" />
                <XAxis dataKey="name" fontSize={theme.fontSizes.xs} />
                <YAxis fontSize={theme.fontSizes.xs} />
                <Tooltip
                  contentStyle={{
                    background: useColorModeValue(
                      "white",
                      theme.colors.gray["900"]
                    ),
                    borderRadius: theme.radii.md,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="despesas"
                  fill={useColorModeValue(
                    theme.colors.red["600"],
                    theme.colors.red["300"]
                  )}
                />
                <Bar
                  dataKey="receitas"
                  fill={useColorModeValue(
                    theme.colors.green["600"],
                    theme.colors.green["300"]
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box>
            <Table size={"sm"} variant="striped">
              <TableCaption>
                Últimas Vendas de Hoje{" "}
                <Button size="xs" ml={2} colorScheme="blue">
                  Veja Mais
                </Button>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>DESCRIÇÃO</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Recebimento de Aluguel</Td>
                  <Td isNumeric>R$ 1200,00</Td>
                  <Td>
                    <Tag colorScheme={"yellow"}>Aguardando</Tag>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Grid>
      </Box>
    </Fragment>
  );
}
