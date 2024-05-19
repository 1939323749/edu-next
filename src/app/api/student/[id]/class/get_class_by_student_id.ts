import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getClass(
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

    try {
        const classData = await prisma.class.findFirst({
            where: {
                id: Number(params.id),
            },
            select: {
                id: true,
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                courses: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
        });

        if (!classData) {
            return Response.json({
                msg: "error",
                error: "class not found",
            });
        }

        return Response.json({
            msg: "success",
            data: classData,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "internal server error",
        });
    }
}