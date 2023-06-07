import { useEffect } from "react";
import { useRouter } from "next/router";
import UserLayout from "@layouts/UserLayout";
import { decodeToken } from "@utils/index";
import { UploadSchedule } from "@schedule/index";

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UploadSchedule />
      </div>
    </UserLayout>
  );
}
