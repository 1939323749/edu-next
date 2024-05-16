import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!Number(params.id)) {
            return Response.json({
                msg: "error",
                error: "invalid id",
            });
        }
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid id",
        });
    }
    return Response.json({
        msg: "success",
        data: {
            gpa: 3.5,
        },
    });
}