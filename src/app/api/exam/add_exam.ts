import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/exam:
 *  post:
 *   description: 为课程添加考试
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        course_id:
 *         type: number
 *         description: 课程id
 *         example: 1
 *        exam_name:
 *         type: string
 *         description: 考试名称
 *         example: 期中考试
 *        exam_description:
 *         type: string
 *         description: 考试描述
 *         example: 本次考试内容为第一章至第三章
 *        exam_date:
 *         type: string
 *         description: 考试日期
 *         example: 2022-12-31
 *        start_time:
 *         type: string
 *         description: 考试开始时间
 *         example: 08:00:00
 *        end_time: 
 *         type: string
 *         description: 考试结束时间
 *         example: 10:00:00
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Invalid data
 */
export async function POST(req: NextRequest) {
    var data: {
        course_id: number;
        exam_name: string;
        exam_description: string | undefined;
        exam_date: string;
        start_time: string;
        end_time: string;
        address: string;
    }

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
            course_id: z.number(),
            exam_name: z.string(),
            exam_description: z.string().optional(),
            exam_date: z.string(),
            start_time: z.string(),
            end_time: z.string(),
            address: z.string(),
        }).parse(data);

        const exam = await prisma.exam.create({
            data: {
                name: data.exam_name,
                description: data.exam_description,
                start: new Date(data.exam_date + " " + data.start_time).toISOString(),
                end: new Date(data.exam_date + " " + data.end_time).toISOString(),
                course: {
                    connect: {
                        id: data.course_id,
                    }
                },
                location: {
                    connect: {
                        id: await prisma.location.findFirst({
                            where: {
                                address: data.address,
                            }
                        }).then(async (res) => res?.id ?? await prisma.location.create({
                            data: {
                                name: data.address,
                                address: data.address,
                            }
                        }).then((res) => res.id)
                    )
                    }
                }
            }
        });

        return Response.json({
            msg: "success",
            data: exam,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: error,
        }, {
            status: 500,
        });
    }
}