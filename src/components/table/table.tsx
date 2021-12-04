import { useEffect, useRef, useState } from "react";
import styles from "./table.module.scss";

type SortFunction<T extends object> = (row: T) => any;

export interface ColumnData<T extends object> {
  name: string;
  key?: string;
  render?: (row: T) => JSX.Element | string;
  isSortable?: boolean;
  sortFunc?: SortFunction<T>;
}

interface TableProps<T extends object>
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  columns: Array<ColumnData<T>>;
  rows: T[];
  minWidth?: number;
}

const Table = <T extends object = any>({
  columns,
  rows,
  minWidth,
  ...props
}: TableProps<T>) => {
  console.log("Reloaded"); // Test how many times the component gets re-rendered
  const tableRef = useRef() as React.MutableRefObject<HTMLTableElement>;
  const [tableWidth, setTableWidth] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const dim = useDimensions();
  let mutRows = [...rows];

  const sortRows = (
    rows: any[],
    sortedField: string | null,
    order: "asc" | "desc" | null
  ) => {
    if (!order || !sortedField) return [...rows];

    return rows.sort((a, b) => {
      let columnSort: ColumnData<T> | ColumnData<T>[] | undefined = [
        ...columns,
      ];
      let varA;
      let varB;

      columnSort = columnSort.find((val) => {
        return (val.key || toCamelCase(val.name)) === selectedColumn;
      });

      if (columnSort?.sortFunc) {
        console.log(columnSort.sortFunc(a));

        varA =
          typeof columnSort.sortFunc(a) === "string"
            ? columnSort.sortFunc(a).toLowerCase()
            : columnSort.sortFunc(a);
        varB =
          typeof columnSort.sortFunc(b) === "string"
            ? columnSort.sortFunc(b).toLowerCase()
            : columnSort.sortFunc(b);
      } else {
        varA =
          typeof a[sortedField] === "string"
            ? a[sortedField].toLowerCase()
            : a[sortedField];
        varB =
          typeof b[sortedField] === "string"
            ? b[sortedField].toLowerCase()
            : b[sortedField];
      }
      let comparison = 0;
      if (typeof varA === "undefined" || typeof varB === "undefined") {
        if (typeof varA === "undefined") {
          if (typeof varB !== "undefined") {
            comparison = -1;
          }
        } else if (typeof varB === "undefined") {
          comparison = 1;
        }
      } else if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    });
  };

  mutRows = sortRows(mutRows, selectedColumn, order);

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
      {...props}
      className={`${styles.table} ${mobile ? styles.mobile : ""} ${
        props.className || ""
      }`}
      ref={tableRef}
    >
      <thead>
        <tr>
          {columns.map((col) => {
            const key = col.key ? col.key : toCamelCase(col.name);
            return (
              <th
                key={`col-title-${key}`}
                onClick={() => {
                  if (selectedColumn === key) {
                    if (order === "asc") setOrder("desc");
                    else {
                      setSelectedColumn(null);
                      setOrder(null);
                    }
                  } else {
                    setSelectedColumn(key);
                    setOrder("asc");
                  }
                }}
              >
                {col.name}
                <p
                  className={
                    col.isSortable !== false
                      ? `arrow ${
                          key === selectedColumn
                            ? order === "desc"
                              ? "up"
                              : "down"
                            : "right"
                        }`
                      : ""
                  }
                />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {mutRows.map((row, rowIndex) => {
          return (
            <tr key={`row-${rowIndex}-data`}>
              {columns.map((col, colIndex) => {
                const rowWithTypeAny = row as any;
                const key = col.key ? col.key : toCamelCase(col.name);

                return (
                  <td key={`col-${colIndex}-row-${row}-data`}>
                    <div
                      className={styles.title}
                      style={{
                        minWidth: minWidth || "175px",
                      }}
                    >
                      {col.name}
                    </div>
                    <div className={styles.data}>
                      {col.render ? col.render(row) : rowWithTypeAny[key]}
                    </div>
                  </td>
                );
              })}
            </tr>
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

function toCamelCase(str: string) {
  const regExp = /[-_ ]\w/gi;
  let newStr = str.replace(regExp, (match) => {
    return match[1].toUpperCase();
  });
  newStr = newStr[0].toLowerCase() + newStr.slice(1, newStr.length);
  return newStr;
}

export default Table;
