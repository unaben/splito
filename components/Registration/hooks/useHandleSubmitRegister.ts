import { registerAction } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";


const useHandleSubmitRegister = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmitRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
  
      const formData = new FormData(e.currentTarget);
  
      startTransition(async () => {
        const result = await registerAction(formData);
  
        if (result?.error) {
          setError(result.error);
          return;
        }
  
        const res = await signIn("credentials", {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          redirect: false,
        });
  
        if (res?.error) {
          setError("Registration succeeded but sign-in failed. Please log in.");
          router.push("/login");
          return;
        }
  
        router.push("/dashboard");
      });
    };
  return {isPending, error, handleSubmitRegister}
}

export default useHandleSubmitRegister