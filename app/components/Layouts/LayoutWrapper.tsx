import type { FC, ReactElement } from "react";
import DefaultLayout from "./Default";

type Props = {
  children: ReactElement;
};

const LayoutWrapper: FC<Props> = ({ children, ...rest }) => {
  // if not render children with fragment
  return <DefaultLayout {...rest}>{children}</DefaultLayout>;
};

export default LayoutWrapper;
