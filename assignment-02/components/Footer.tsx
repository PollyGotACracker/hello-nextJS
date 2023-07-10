import Image from "next/image";
import styles from "../styles/Home.module.css";

type FooterProps = {
  aHref: string;
  imgSrc: string;
  imgAlt: string;
  text: string;
};

const Footer: React.FC<FooterProps> = ({ aHref, imgSrc, imgAlt, text }) => {
  return (
    <footer className={styles.footer}>
      <a href={aHref} target="_blank" rel="noopener noreferrer">
        <span className={styles.logo}>
          <Image src={imgSrc} alt={imgAlt} width={24} height={24} />
          {text}
        </span>
      </a>
    </footer>
  );
};

export default Footer;
