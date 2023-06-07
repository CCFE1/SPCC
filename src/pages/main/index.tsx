import { useEffect } from "react";
import { useRouter } from "next/router";
import UserLayout from "@layouts/UserLayout";
import { selectSelectedLoan } from "@loan/slices";
import { useAppSelector, useAppDispatch } from "@store/hooks";

import { CreateLoanForm, ActiveLoansList, ModifyLoanForm } from "@loan/index";

import { decodeToken } from "@utils/index";

export default function Main() {
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
          alignItems: "center",
        }}
      >
        {!loan ? <CreateLoanForm /> : <ModifyLoanForm />}
        <ActiveLoansList />
      </div>
    </UserLayout>
  );
}
