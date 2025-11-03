import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/task/$id/comments")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("oi");
  return <div>Hello "/_authenticated/task/$id/comments"!</div>;
}
