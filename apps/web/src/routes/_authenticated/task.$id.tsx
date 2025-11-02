import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/task/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  console.log(id);
  return (
    <Layout>
      <CenteredContainer>
        <p className="text-input">{id}das</p>
      </CenteredContainer>
    </Layout>
  );
}
