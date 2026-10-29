import 'dotenv/config';
import { createApp } from './app';
import { setupPostgres } from './postgres/state';

async function main() {
  if (process.env.SIGPRA_STORAGE === 'postgres') {
    try {
      await setupPostgres();
      console.log('SIGPRA: PostgreSQL conectado');
    } catch (err: any) {
      console.warn('⚠️ No se pudo conectar a PostgreSQL (' + err.message + '). Iniciando en modo local (JSON Store)...');
      process.env.SIGPRA_STORAGE = 'json';
    }
  }
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, () => console.log('SIGPRA API MVC disponible en http://localhost:' + port));
}
main().catch(err => { console.error('No se pudo iniciar SIGPRA:', err.message); process.exitCode = 1; });
