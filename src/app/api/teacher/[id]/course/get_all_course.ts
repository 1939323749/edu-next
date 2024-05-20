import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getCourse(
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
        const courses = await prisma.course.findMany({
        where: {
            teachers: {
                some: {
                    id: Number(params.id)
                }
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            department: {
                select: {
                    id: true,
                    name: true,
                }
            },
        }
        })

        return Response.json({
            msg: "success",
            data: courses,
        })

    } catch (error) {
        return Response.json({
            msg: "error",
            error: "course not found",
            details: error
        });
    }
    


}