import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function importScore(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    var data: {
        student_id: number,
        score: number,
    }
    
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
        data = await req.json();
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }

    try {

        const student = await prisma.student.findUnique({
            where: {
                id: data.student_id
            },
            select: {
                id: true,
                name: true,
            }
        })

        if(!student){
            return Response.json({
                msg: "error",
                error: "student not found",
            });
        }
        const course = await prisma.course.findUnique({
            where: {
                id: Number(params.id)
            },
            select: {
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }
        })
        if(!course){
            return Response.json({
                msg: "error",
                error: "course not found",
            });
        }

        const updateScore = await prisma.score.create({
            data: {
                student: {
                    connect: {
                        id: data.student_id,
                    },
                },
                exam: {
                    connect: {
                        id: Number(params.id),
                    },
                },
                score: data.score,
            },
        })

        return Response.json({
            msg: "success",
            data: course,
        })
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "error",
            details: error
        });
    }
}