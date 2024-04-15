import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!Number(params.id)) {
        return Response.json({
            msg: "error",
            error: "invalid id",
        });
    }
    try {
        const student = await prisma.student.findUniqueOrThrow({
            where: {
                id: Number(params.id),
            },
            select: {
                id: true,
                name: true,
                courses: {
                    select: {
                        name: true,
                        locations: {
                            select: {
                                name: true,
                                address: true,
                            },
                        },
                        time_blocks: {
                            select: {
                                start: true,
                                end: true,
                                week_start: true,
                                week_end: true,
                            },
                        },
                    },
                },
            },
        });
        return Response.json({
            msg: "success",
            data: student,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid id",
            details: error,
        });
    }
}
    