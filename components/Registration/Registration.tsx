import useHandleSubmitRegister from "./hooks/useHandleSubmitRegister";
import styles from "./Registration.module.css";

const Registration = () => {
  const { isPending, error, handleSubmitRegister } = useHandleSubmitRegister();

  return (
    <div className={styles.card}>
      <div className={styles.logo}>
        spli<span className={styles.logoAccent}>to</span>
      </div>
      <h1 className={styles.title}>Create your account</h1>
      <p className={styles.subtitle}>Free to use · No credit card needed</p>

      <form onSubmit={handleSubmitRegister} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={styles.input}
            placeholder="Alex Johnson"
            required
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="alex@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isPending} className={styles.btn}>
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className={styles.loginHint}>
        Already have an account?{" "}
        <a href="/login" className={styles.loginLink}>
          Sign in
        </a>
      </p>
    </div>
  );
};

export default Registration;
