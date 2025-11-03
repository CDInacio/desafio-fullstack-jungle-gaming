import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/task/$id/comments")({
  component: RouteComponent,
});

function RouteComponent() {
  const { params } = useParams({ strict: false });
  console.log(params);
  return <div>Hello "/_authenticated/task/$id/comments"!</div>;
}
