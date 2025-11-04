import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <CenteredContainer className="text-input">s</CenteredContainer>
    </Layout>
  );
}
