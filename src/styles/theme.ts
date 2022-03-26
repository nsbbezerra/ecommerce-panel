import { extendTheme, theme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,
  fonts: {
    body: "Roboto Condensed, system-ui, sans-serif",
    heading: "Roboto Condensed, system-ui, sans-serif",
  },
  components: {
    Menu: {
      baseStyle: {
        list: {
          boxShadow: "lg",
        },
      },
    },
  },
});

export { customTheme };
