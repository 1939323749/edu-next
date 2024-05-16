import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";
/**
 * @swagger
 * /api/course/{id}:
 *  put:
 *   description: 通过id更新课程信息
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         nullable: true
 *        credit:
 *         type: number
 *         nullable: true
 *        description:
 *         type: string
 *         nullable: true
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Invalid data
 */
export async function PUT(
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

    var data: {
        name: string | undefined,
        credit: number | undefined,
        description: string | undefined,
        location: {
            loca_id: number,
            time_block_id: number,
        } | undefined,
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
            name: z.string().optional(),
            credit: z.number().optional(),
            description: z.string().optional(),
            location: z.object({
                loca_id: z.number(),
                time_block_id: z.number(),
            }).optional(),
        }).parse(data)    
        
        if (data.location !== undefined) {
            const existed_course = await prisma.location.findFirst({
                where: {
                    AND: {
                        id: data.location.loca_id,
                        timeBlock: {
                            some: {
                                id: data.location.time_block_id,
                            },
                        },
                    },
                },
            })
            if (existed_course) {
                return Response.json({
                    msg: "error",
                    error: "time not available"
                });
            }
        }

        await prisma.location.update({
            where: {
                id: data.location?.loca_id,
            },
            data: {
                timeBlock: {
                    connect: {
                        id: data.location?.time_block_id,
                    },
                },
            },
        })

        const updatedData = await prisma.course.update({
            where: {
                id: Number(params.id),
            },
            data: {
                name: data.name,
                credit: data.credit,
                description: data.description,
                time_blocks: {
                    connect: {
                        id: data.location?.time_block_id,
                    },
                },
            },
        }).then((data) => {
            return {
                name: data.name,
                credit: data.credit,
                description: data.description,
            }
        })
        return Response.json({
            msg: "success",
            data: updatedData,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }
}