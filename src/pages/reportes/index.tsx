import { useEffect } from "react";
import { useRouter } from "next/router";
import UserLayout from "@layouts/UserLayout";
import { decodeToken } from "@utils/index";
import { GenerateReports } from "@reports/index";

export default function SubirPrestamos() {
  const router = useRouter();

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
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <GenerateReports />
      </div>
    </UserLayout>
  );
}
