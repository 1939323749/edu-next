import prisma from "@/app/db";
import { NextRequest } from "next/server";
/**
 * @swagger
 * /api/course/{id}:
 *  get:
 *   description: 通过id获取课程信息
 *   parameters:
 *   - in: path
 *     name: id
 *     required: true
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Invalid id
 */
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
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
    return Response.json({
        msg: "success",
        data: await prisma.course.findFirst({
            where: {
                id: Number(params.id),
            },
            select: {
                id: true,
                name: true,
                description: true,
                credit: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                        major: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                time_blocks: {
                    select: {
                        id: true,
                        week_start: true,
                        week_end: true,
                        day_of_week: true,
                        start: true,
                        end: true,
                        location: {
                            select: {
                                name: true,
                                address: true,
                            },
                        },
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
    });
}