import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";
import { getGridFSBucket } from "@/lib/gridfs";
import { Readable } from "stream";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid file ID",
        },
        { status: 400 }
      );
    }

    const bucket = getGridFSBucket();

    const files = await bucket
      .find({
        _id: new ObjectId(id),
      })
      .toArray();

    if (!files.length) {
      return Response.json(
        {
          success: false,
          message: "Certificate PDF not found",
        },
        { status: 404 }
      );
    }

    const file = files[0];

    const downloadStream = bucket.openDownloadStream(
      new ObjectId(id)
    );

    return new Response(Readable.toWeb(downloadStream) as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
     "Content-Disposition": `inline; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    console.error("Certificate download error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to download certificate",
      },
      { status: 500 }
    );
  }
}