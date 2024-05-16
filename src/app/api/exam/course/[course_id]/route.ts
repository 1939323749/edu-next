import prisma from "@/app/db";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/exam/course/{course_id}:
 *  get:
 *   description: 获取课程的考试信息
 *   parameters:
 *     - in: path
 *       name: course_id
 *       required: true
 *       example: 1
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Invalid id
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { course_id : string } }
){
    if (!Number(params.course_id)) {
        return Response.json({
            msg: "error",
            error: "invalid id",
            details: params
        });
    }

    var data = await prisma.course.findUnique({
        where: {
            id: Number(params.course_id),
        },
        include: {
            exams: true,
        }
    });

    if (data == null) {
        return Response.json({
            msg: "error",
            error: "course not found",
        });
    }

    return Response.json({
        msg: "success",
        data: {
            course: {
                id: data.id,
                name: data.name,
                exams: data.exams.map((exam) => {
                    return {
                        id: exam.id,
                        name: exam.name,
                        description: exam.description,
                        start: exam.start,
                        end: exam.end,
                    }
                })
            }
        },
    });
}

export { POST } from './add_exam'