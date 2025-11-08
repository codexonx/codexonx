import { FormEvent, useState } from 'react';

import { useAuth } from '../../../contexts/auth-context';
import styles from '../styles.module.css';

export function LoginPanel() {
  const { login, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    try {
      await login(email, password);
    } catch {
      // error state context üzerinden yönetiliyor
    }
  };

  const showError = Boolean(error) && hasSubmitted;

  return (
    <section className={styles.loginPanel}>
      <header className={styles.loginHeader}>
        <span className={styles.badge}>Giriş Yap</span>
        <h1>CodeXonX Desk</h1>
        <p>Masaüstü uygulamasına erişmek için hesap bilgilerinizle giriş yapın.</p>
      </header>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label className={styles.loginLabel} htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="ornek@codexonx.com"
          value={email}
          onChange={event => {
            if (error) clearError();
            setEmail(event.target.value);
          }}
          className={styles.loginInput}
          autoComplete="email"
          disabled={isLoading}
        />

        <label className={styles.loginLabel} htmlFor="password">
          Parola
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={event => {
            if (error) clearError();
            setPassword(event.target.value);
          }}
          className={styles.loginInput}
          autoComplete="current-password"
          disabled={isLoading}
        />

        <button className={styles.loginButton} type="submit" disabled={isLoading}>
          {isLoading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </button>
      </form>

      {showError ? <p className={styles.loginError}>{error}</p> : null}
      <p className={styles.loginHelper}>
        Hesabınız yok mu? Web üzerinden kaydolup workspace oluşturabilirsiniz.
      </p>
    </section>
  );
}
