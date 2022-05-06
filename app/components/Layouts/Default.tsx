import type { ReactElement } from "react";
import { Box, Flex } from "@chakra-ui/react";

function DefaultLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <Flex
        height={["90vh", "100vh", "100vh", "100vh"]}
        flexDirection="column"
        justify="center"
        align="center"
      >
        {children}
      </Flex>
    </>
  );
}

export default DefaultLayout;
