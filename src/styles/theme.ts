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
    FormLabel: { baseStyle: { mb: 0, fontWeight: "600" } },
  },
});

export { customTheme };
