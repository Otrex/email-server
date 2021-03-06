import { scriptLogger } from '../lib/logger';

export const script = async () => {
  await Promise.all([]);
};

const run = async () => {
  if (require.main === module) {
    try {
      await script();
    } catch (e) {
      scriptLogger.error(e);
    } finally {
      process.exit(0);
    }
  }
};

export default run();
