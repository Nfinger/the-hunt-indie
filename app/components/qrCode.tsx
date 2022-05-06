import { Box } from "@chakra-ui/react";

interface IQrCode {
  position: string;
}

const getPosition = (
  position: string
): { top?: string; left?: string; right?: string; bottom?: string } => {
  let top = undefined;
  let left = undefined;
  let right = undefined;
  let bottom = undefined;

  switch (position) {
    case "top-right":
      top = "0";
      right = "-50px";
      break;
    case "top-left":
      top = "0";
      left = "-50px";
      break;
    default:
      top = "0";
      left = "0";
      break;
  }

  return { top, left, right, bottom };
};

export const QrCode = ({ position }: IQrCode) => {
  return (
    <Box
      sx={{
        position: "absolute",
        ...getPosition(position),
        height: "100px",
        width: "100px",
      }}
    >
      <img src="/static/w3w.jpeg" />
    </Box>
  );
};
