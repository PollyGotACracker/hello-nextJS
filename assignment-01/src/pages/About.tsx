import Header from "../components/Header";
import Button from "../components/Button";
import PATH from "../constants/path";

const About = () => {
  return (
    <>
      <Header text={"about"}></Header>
      <Button text={"go main"} path={PATH.ROOT} />
    </>
  );
};

export default About;
