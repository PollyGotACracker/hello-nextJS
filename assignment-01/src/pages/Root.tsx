import Header from "../components/Header";
import Button from "../components/Button";
import PATH from "../constants/path";

const Root = () => {
  return (
    <>
      <Header text={"root"}></Header>
      <Button text={"about"} path={PATH.ABOUT} />
    </>
  );
};

export default Root;
