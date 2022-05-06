import { Flex, HStack, Text, Divider } from "@chakra-ui/react";
import React from "react";

export const Steps = ({
  currentStep,
  onClick,
}: {
  currentStep: number;
  onClick: (index: number) => void;
}) => {
  return (
    <HStack justify="space-between" mb="10">
      {new Array(3).fill({}).map((v, idx) => (
        <React.Fragment key={idx}>
          <Flex
            sx={{
              borderRadius: "50%",
              height: "50px",
              width: "50px",
            }}
            cursor={idx < currentStep ? "pointer" : "auto"}
            align="center"
            justify="center"
            bg={idx < currentStep ? "green" : "gray"}
            onClick={() => onClick(idx)}
          >
            <Text textStyle="body36">{idx + 1}</Text>
          </Flex>
          {idx < 2 && (
            <Divider
              w="20px"
              colorScheme={idx < currentStep ? "green" : "gray"}
            />
          )}
        </React.Fragment>
      ))}
    </HStack>
  );
};
