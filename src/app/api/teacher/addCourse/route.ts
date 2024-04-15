import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    var data: {
        teacher_id: number;
        course_id: number;
    };
    try {
        data = await req.json();
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid json format",
        });
    }
    try {
        z.object({  
            teacher_id: z.number(),
            course_id: z.number(),
        }).parse(data);
        const course = await prisma.course.findFirst({
            where: {
                id: data.course_id
            },
            select: {
                teachers: {
                    where: {
                        id: data.teacher_id
                    }
                }
            }
        })
        if(course && course.teachers.find((teacher) => teacher.id === data.teacher_id) != undefined){
            return Response.json({
                msg: "error",
                error: "teacher already added, please check again",
                data: course
            });
        }
        await prisma.teacher.update({
            where: {
                id: data.teacher_id,
            },
            data: {
                courses: {
                    connect: {
                        id: data.course_id,
                    },
                },
            },
        });
        return Response.json({
            msg: "success",
            data: "course added",
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            detail: error
        });
    }
}