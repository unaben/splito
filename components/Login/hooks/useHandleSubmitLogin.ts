import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

const useHandleSubmitLogin = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmitLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }
  return { isPending, error, handleSubmitLogin };
};

export default useHandleSubmitLogin;
