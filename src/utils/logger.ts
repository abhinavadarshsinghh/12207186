import axios from 'axios';

const API_URL = 'http://20.244.56.144/evaluation-service/logs';

const allowedStacks = ['backend', 'frontend'];
const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const allowedPackages = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils'
];

export async function logEvent(stack: string, level: string, pkg: string, message: string) {
  if (!allowedStacks.includes(stack) || !allowedLevels.includes(level) || !allowedPackages.includes(pkg)) {
    return;
  }

  try {
    await axios.post(API_URL, {
      stack,
      level,
      package: pkg,
      message
    });
  } catch (err) {
  }
}
