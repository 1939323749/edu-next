import prisma from "@/app/db";
import { Score } from "@mui/icons-material";
import { NextRequest } from "next/server";
import { number, z } from "zod";

/**
 * @swagger
 * /api/exam/{id}/set_score:
 *  post:
 *   description: 为考试设置学生成绩
 *  parameters:
 *   - name: id
 *     in: path
 *     required: true
 *     description: 考试id
 *  requestBody:
 *   content:
 *    application/json:
 *     schema:
 *      type: object
 *      properties:
 *       student_id:
 *        type: number
 *       score:
 *        type: number
 *        minimum: 0
 *        maximum: 100
 *  responses:
 *   200:
 *    description: Success
 *   400:
 *    description: Invalid data
*/
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!Number(params.id)) {
        return Response.json({
            msg: "error",
            error: "invalid id",
        });
    }

    var data : {
        student_id: number;
        score: number;
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
            student_id: z.number(),
            score: z.number().min(0).max(100),
        }).parse(data);

        const exist_student = await prisma.student.findUnique({
            where: {
                id: data.student_id,
            },
        });

        if (!exist_student) {
            return Response.json({
                msg: "error",
                error: "student not found",
            });
        }

        const student = await prisma.score.create({
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
        });
        return Response.json({
            msg: "success",
            data: student,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: error,
        });
    }
}