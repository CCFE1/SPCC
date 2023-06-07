import { useEffect, useState } from "react";
import { TableMui } from "@ui/index";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { getHeadCells } from "./LoansListData";
import { getCustomRow } from "./LoanListComponents";
import { decodeToken } from "@utils/index";

import { 
  fetchLoans, 
  selectLoansList 
} from "./loansListSlice";

// Aqui la tabla de préstamos con todos los préstamos.
export default function LoansList() {
  const dispatch = useAppDispatch();
  const rows = useAppSelector(selectLoansList);
  const [headCells, setHeadCells] = useState<any>([]);

  useEffect(() => {
    const { rol } = decodeToken();
    setHeadCells(getHeadCells(rol));
    
    dispatch(fetchLoans());
  }, []);

  return <TableMui rows={rows} headCells={headCells} getCustomRow={getCustomRow} />
}
