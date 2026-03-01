import styles from './Login.module.scss';

export default function Login() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1>З поверненням!</h1>
        <p>Увійдіть у свій аккаунт</p>
        
        <form>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" placeholder="example@mail.com" />
          </div>
          
          <div className={styles.formGroup}>
            <label>Пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};