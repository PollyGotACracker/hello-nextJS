import StyledComponentsRegistry from "./styled-components/registry";

// https://github.com/vercel/app-playground/blob/main/app/styling/styled-components/layout.tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>;
};

export default Layout;
