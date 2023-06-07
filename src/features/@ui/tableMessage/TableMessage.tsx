import type { TableMessageProps } from "@models/interfaces";

// Mensaje en la tabla, para esto el tbody debe tener display flex
export default function TableMessage(props: TableMessageProps) {
  return (
    <tr
      className="f-center"
      style={{
        flexGrow: 1,
      }}
    >
      <th>{props.msg}</th>
    </tr>
  );
}
