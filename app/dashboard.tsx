import { Redirect } from 'expo-router';

export default function PageDashboardRedirect() {
  return <Redirect href="/(dashboard-tabs)" />;
}