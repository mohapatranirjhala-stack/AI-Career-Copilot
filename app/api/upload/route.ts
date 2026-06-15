export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume") as File;

    return Response.json({
      success: true,
      fileName: file?.name,
      size: file?.size,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      message: error?.message,
    });
  }
}
