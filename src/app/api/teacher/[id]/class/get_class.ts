import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getClass(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if(!Number(params.id)){
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
        const classes = await prisma.class.findMany({
            where: {
                courses: {
                    some: {
                        teachers: {
                            some: {
                                id: Number(params.id)
                            }
                        }
                    }
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }
        }
        )
        return Response.json({
            msg: "success",
            data: classes,
        })
    }
catch (error) {
        return Response.json({
            msg: "error",
            error: "course not found",
            details: error
        });
    }
}