import prisma from "@/app/db";
import { teal } from "@mui/material/colors";
import { NextRequest } from "next/server";
/**
 * @swagger
 * /api/class:
 *  get:
 *   description: 获取所有班级信息
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         msg:
 *          type: string
 *          example: "success"
 *         data:
 *          type: array
 *    500:
 *     description: Internal Server Error
 *             
 */
export async function GET(req: NextRequest) {
    return Response.json({
        msg: "success",
        data: await prisma.class.findMany({
            select: {
                id: true,
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        students: true
                    }
                },
                courses: {
                    select: {
                        name: true,
                    }
                }
            }
        }),
    });
}

export { POST } from './add_class'