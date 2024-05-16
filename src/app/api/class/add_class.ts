import prisma from "@/app/db";
import { NextRequest } from "next/server";
/**
 * @swagger
 * /api/class/add_class:
 *  post:
 *   description: 添加班级
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: 班级名称
 *         example: "班级1"
 *        description:
 *         type: string
 *         nullable: true
 *         description: 班级描述
 *         example: "这是一个班级"
 *  responses:
 *   200:
 *    description: Success
 *    content:
 * 
 *   400:
 *    description: Invalid data
*/
export async function POST(req: NextRequest) {
    var data:{
        name: string,
        description: string | null,
    }
    try {
        data = await req.json();
    } catch (e) {
        return Response.json({
            msg: "error",
            error: "Invalid JSON",
        });
    }
    if (!data.name) {
        return Response.json({
            msg: "error",
            error: "Name is required",
        });
    }

    const name_conflict = await prisma.class.findFirst({
        where: {
            name: data.name,
        },
    });
    if (name_conflict) {
        return Response.json({
            msg: "error",
            error: "Name conflict",
        });
    }

    const result = await prisma.class.create({
        data: {
            name: data.name,
            description: data.description,
        },
    });
    return Response.json({
        msg: "success",
        data: {
            id: result.id,
            name: result.name,
            description: result.description,
        }
    });
}