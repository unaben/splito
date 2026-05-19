"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./SignoutButton.module.css";

const SignoutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div>
      <button onClick={handleSignOut} className={styles.signout}>
        Sign out
      </button>
    </div>
  );
};

export default SignoutButton;
