import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/home",
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <CenteredContainer className="text-input">ola mundo</CenteredContainer>
    </Layout>
  );
}
