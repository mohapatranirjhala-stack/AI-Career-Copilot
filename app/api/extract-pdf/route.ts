const pdfParse = require("pdf-parse-fixed");

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const result = await pdfParse(buffer);

    return Response.json({
      extractedText:
        result.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "PDF extraction failed",
      },
      { status: 500 }
    );
  }
}