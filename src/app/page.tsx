import logger from 'src/logger';
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Hiduka: The starting point for your next project',
};

export default function HomePage() {
  logger.error(new Error("things got bad"), "error message")
  return <HomeView />;
}
