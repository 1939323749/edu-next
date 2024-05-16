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
                        id: true,
                        name: true,
                        time_blocks: {
                            select: {
                                week_start: true,
                                week_end: true,
                                day_of_week: true,
                                start: true,
                                end: true,
                                location: {
                                    select: {
                                        name: true,
                                        address: true,
                                    },
                                }
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
    