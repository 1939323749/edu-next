import prisma from "@/app/db";
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
        data: await prisma.exam.findMany({
            where: {
                course: {
                    some: {
                        students: {
                            some: {
                                id: Number(params.id),
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                start: true,
                end: true,
                course: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
    });
}