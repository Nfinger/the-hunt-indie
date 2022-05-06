import { extendTheme } from "@chakra-ui/react";
import type { GlobalStyleProps } from "@chakra-ui/theme-tools";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

export const theme = extendTheme({
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        backgroundColor: "#000000",
        color: "white",
      },
    }),
  },
  colors,
  fonts: {
    heading: "RumbleBrave",
    body: "RumbleBrave",
  },
  textStyles: {
    bold: {
      fontSize: "24px",
      fontWeight: "bold",
      fontFamily: "Helvetica",
    },
    body48: {
      fontSize: "48px",
      lineHeight: "150%",
    },
    body36: {
      fontSize: "36px",
      lineHeight: "150%",
    },
    body24: {
      fontSize: "24px",
      lineHeight: "150%",
    },
    body20: {
      fontSize: "20px",
      lineHeight: "150%",
    },
    body18: {
      fontSize: "18px",
      lineHeight: "150%",
    },
    body16: {
      fontSize: "16px",
      lineHeight: "150%",
    },
    body14: {
      fontSize: "14px",
      lineHeight: "150%",
    },
    body12: {
      fontSize: "12px",
      lineHeight: "150%",
    },
    body10: {
      fontSize: "10px",
      lineHeight: "150%",
    },
  },
  fontSizes: {
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
    "6xl": "3.5rem",
    "7xl": "5.5rem",
  },
  components: {
    Button: {
      defaultProps: {
        variant: "unstyled",
      },
      _hover: {
        bg: "transparent",
        borderColor: "red.500",
      },
      _focus: {
        bg: "transparent",
        borderColor: "red.500",
      },
    },
    Input: {
      variants: {
        danger: {
          borderColor: "red.500",
          bg: "transparent",
        },
      },
    },
  },
});
