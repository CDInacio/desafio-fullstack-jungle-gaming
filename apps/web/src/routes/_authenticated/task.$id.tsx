import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/task/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <CenteredContainer>oi</CenteredContainer>
    </Layout>
  );
}
