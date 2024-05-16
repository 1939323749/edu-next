import prisma from "@/app/db";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/class/{id}:
 *  get:
 *   description: 通过id获取班级信息
 *   parameters:
 *     - in: path
 *       name: id
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
		data: await prisma.class.findFirst({
			where: {
				id: Number(params.id),
			},
			select: {
				id: true,
				name: true,
				students: {
					select: {
						id: true,
						name: true,
					},
				},
                courses: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        students: true,
                    },
                },
			},
		}),
	});
}
