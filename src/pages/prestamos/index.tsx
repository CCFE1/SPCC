import { useEffect } from "react";
import { useRouter } from "next/router";
import UserLayout from "@layouts/UserLayout";
import { selectSelectedLoan } from "@loan/slices";
import { useAppSelector } from "@store/hooks";
import { decodeToken } from "@utils/index";
import { LoansList } from "@loan/index";

export default function Prestamos() {
  const router = useRouter();
  const loan = useAppSelector(selectSelectedLoan);

  useEffect(() => {
    const userData: any = decodeToken();
    if (!userData) {
      localStorage.clear();
      router.replace("/");
    }
  }, []);

  return (
    <UserLayout>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <LoansList />
      </div>
    </UserLayout>
  );
}
