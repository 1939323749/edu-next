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
        data: await prisma.score.findMany({
            where: {
                student: {
                    id: Number(params.id),
                }
            },
            select: {
                id: true,
                score: true,
                exam: {
                    select: {
                        name: true,
                        description: true,
                        start: true,
                        end: true,
                    },
                },
            },
        }),
    });
}