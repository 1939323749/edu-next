import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function withdrawCourse(
    req: NextRequest,
    { params }: { params: { id: string } }
){
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

    var data: {
        course_id: number,
    }

    try {
        data = await req.json()
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }

    try {
        z.object({
            course_id: z.number(),
        }).parse(data);

        try {
            await prisma.student.findUniqueOrThrow({
                where: {
                    id: Number(params.id),
                },
            });
        } catch (error) {
            return Response.json({
                msg: "error",
                error: "student not found",
            });
        }

        try {
            await prisma.course.findUniqueOrThrow({
                where: {
                    id: data.course_id,
                },
            });
        } catch (error) {
            return Response.json({
                msg: "error",
                error: "course not found",
            });
        }

        const exist_student_course = await prisma.student.findFirst({
            where: {
                id: Number(params.id),
                courses: {
                    some: {
                        id: data.course_id,
                    },
                },
            },
        });

        if (!exist_student_course) {
            return Response.json({
                msg: "error",
                error: "student not enrolled in this course",
            });
        }

        await prisma.student.update({
            where: {
                id: Number(params.id),
            },
            data: {
                courses: {
                    disconnect: {
                        id: data.course_id,
                    },
                },
            },
        });

        return Response.json({
            msg: "success",
        });

    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }
}