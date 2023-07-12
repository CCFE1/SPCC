import { InputLoading } from "@ui/index";
import type { LoadingTableBodyProps } from "@models/interfaces";
import styles from "@loan/active-loans-list/active-loans-list-row/ActiveLoansListRow.module.css";

export default function LoadingTableBody(props: LoadingTableBodyProps) {
  // Funcion que regresa la decisión de si se va a incluir o no el loading
  const include = () => {
    // 6/10 posibilidades de regresar un si
    var notRandomNumbers = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
  };

  const columns = () => {
    const columnsNumber: number[] = [...Array(props.columnsNumber)];
    return columnsNumber.map((x, i) => {
      // Saber si se va o no incluir el loading
      const isInclude = include();
      const tdContent = !!isInclude ? <InputLoading height="4vh" /> : <></>;
      return <td key={i}>{tdContent}</td>;
    });
  };

  return (
    <>
      {[...Array(props.rowsNumber)].map((x, i) => (
        <tr
          key={i}
          className={styles.tBodyFixedTr}
          style={{
            pointerEvents: "none",
          }}
        >
          {columns()}
        </tr>
      ))}
    </>
  );
}
