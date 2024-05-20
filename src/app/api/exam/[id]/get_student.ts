import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getStudentsByExamId(
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
        const students = await prisma.exam.findUnique({
            where: {
                id: Number(params.id)
            },
            select: {
                course: {
                    select: {
                        name: true,
                        students: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    }
                }
            }
        })

        return Response.json({
            msg: "success",
            data: students,
        })
    } catch(error){
        return Response.json({
            msg: "error",
            error: "exam not found",
            details: error
        });
    }
}