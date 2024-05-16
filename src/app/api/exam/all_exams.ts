import prisma from "@/app/db";
import { NextRequest } from "next/server";
/**
 * @swagger
 * /api/exam:
 *  get:
 *   description: 获取所有考试信息
 *  responses:
 *   200:
 *    description: Success
 *  
 */
export async function GET(req: NextRequest){
    const data = await prisma.exam.findMany({
        include: {
            course: true,
        }
    })
    return Response.json({
        msg: "success",
        data: {
            exams: data.map((exam) => {
                return {
                    id: exam.id,
                    name: exam.name,
                    description: exam.description,
                    start: exam.start,
                    end: exam.end,
                    course: exam.course.map((course) => {
                        return {
                            id: course.id,
                            name: course.name,
                        }
                    })
                }
            })
        },
    });
}