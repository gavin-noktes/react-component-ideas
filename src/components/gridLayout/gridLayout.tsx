import styles from "./gridLayout.module.scss";

interface GridLayoutProps {
  children: JSX.Element[]
}

const GridLayout = (props: GridLayoutProps) => {
  return <div className={styles.grid}>
    {props.children}
  </div>;
};

export default GridLayout;
