import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to auth page by default
  return <Redirect href="/auth" />;
}
