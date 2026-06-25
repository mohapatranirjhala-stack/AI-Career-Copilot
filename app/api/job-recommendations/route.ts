
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { role } = await req.json();

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      role + " in India"
    )}&page=1&num_pages=3`,
    {
      headers: {
        "X-RapidAPI-Key":
          process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host":
          "jsearch.p.rapidapi.com",
      },
    }
  );

  const data = await response.json();

if (
  data.message?.toLowerCase().includes(
    "quota"
  )
) {

  return NextResponse.json({
    fallback: true,

    jobs: [
      {
        job_id: "demo1",
        job_title: "Software Engineer",
        employer_name: "Tech Corp",
        job_city: "Remote",
        job_apply_link: "#",
      },

      {
        job_id: "demo2",
        job_title: "AI Engineer",
        employer_name: "AI Labs",
        job_city: "Bangalore",
        job_apply_link: "#",
      },

      {
        job_id: "demo3",
        job_title: "Cloud Engineer",
        employer_name: "CloudWorks",
        job_city: "Hyderabad",
        job_apply_link: "#",
      },

      {
        job_id: "demo4",
        job_title: "DevOps Engineer",
        employer_name: "Infra Systems",
        job_city: "Pune",
        job_apply_link: "#",
      },

    ],

  });

}

return NextResponse.json({

  fallback: false,

  jobs:
    data.data || [],

});
}