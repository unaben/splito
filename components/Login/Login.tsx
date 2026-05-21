import useHandleSubmitLogin from "./hooks/useHandleSubmitLogin";
import styles from "./Login.module.css";

const Login = () => {
  const { isPending, error, handleSubmitLogin } = useHandleSubmitLogin();

  return (
    <div className={styles.card}>
      <div className={styles.logo}>
        spli<span className={styles.logoAccent}>to</span>
      </div>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to your account</p>

      <form onSubmit={handleSubmitLogin} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="alice@example.com"
            required
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <a href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            placeholder="Your password"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isPending} className={styles.btn}>
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
