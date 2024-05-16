import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/exam/course/{course_id}:
 *  post:
 *   description: 为课程添加考试
 *   parameters:
 *    - name: course_id
 *      in: path
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
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
export async function POST(
    req: NextRequest,
    { params }: { params: { course_id: string } }
) {
    var data: {
        exam_name: string;
        exam_description: string | undefined;
        exam_date: string;
        start_time: string;
        end_time: string;
    }

    if (!Number(params.course_id)) {
        return Response.json({
            msg: "error",
            error: "invalid id",
            details: params
        });
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
            exam_name: z.string(),
            exam_description: z.string().optional(),
            exam_date: z.string(),
            start_time: z.string(),
            end_time: z.string(),
        }).parse(data);

        const exam = await prisma.exam.create({
            data: {
                name: data.exam_name,
                description: data.exam_description,
                start: new Date(data.exam_date + " " + data.start_time).toISOString(),
                end: new Date(data.exam_date + " " + data.end_time).toISOString(),
                course: {
                    connect: {
                        id: Number(params.course_id),
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