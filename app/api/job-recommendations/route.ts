
import { jobs } from "@/app/data/jobs";

export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const role =
    body.role;

  const matches =
    jobs.filter(
      (job) =>
        job.role === role
    );

  return Response.json(
    matches
  );
}