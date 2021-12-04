import { Fragment, useEffect, useRef, useState } from "react";
import styles from "./old.module.scss";

interface ColumnData<T extends object = any> {
  name: string;
  key?: string;
  render?: (row: T) => JSX.Element | string;
}

interface TableProps<T extends object = any> {
  columns: Array<ColumnData<T>>;
  rows: T[];
  minWidth?: number;
}

const Table = <T extends object = any>(props: TableProps<T>) => {
  const tableRef = useRef() as React.MutableRefObject<HTMLTableElement>;
  const [mobile, setMobile] = useState(false);
  const [tableWidth, setTableWidth] = useState(0);
  const dim = useDimensions();

  useEffect(() => {
    if (!mobile) {
      setTableWidth(tableRef.current.clientWidth);
    }
    if (dim.width <= tableWidth) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [dim]);

  return (
    <table
      className={`${styles.table} ${mobile ? styles.mobile : ""}`}
      ref={tableRef}
    >
      <thead>
        <tr>
          {props.columns.map((col) => {
            return <th key={`col-title-${col.key || col.name}`}>{col.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, rowIndex) => {
          return (
            <Fragment key={`table-fragment-${rowIndex}`}>
              <tr key={`row-${rowIndex}-title`} className={styles.title}>
                {props.columns.map((col, colIndex) => {
                  return (
                    <td key={`col-${colIndex}-row-${row}-title`}>{col.name}</td>
                  );
                })}
              </tr>
              <tr key={`row-${rowIndex}-data`}>
                {props.columns.map((col, colIndex) => {
                  const rowWithTypeAny = row as any;
                  return (
                    <>
                      <td
                        key={`col-${colIndex}-row-${row}-data`}
                        style={{ display: "flex" }}
                      >
                        {col.render
                          ? col.render(row)
                          : rowWithTypeAny[col.key || col.name] ||
                            rowWithTypeAny[
                              col.name.toLowerCase().replaceAll(" ", "_")
                            ]}
                      </td>
                    </>
                  );
                })}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () =>
      window.removeEventListener("resize", () =>
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      );
  }, []); // Empty array ensures that effect is only run on mount

  return dimensions;
};

export default Table;
