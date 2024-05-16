import prisma from "@/app/db";
import { error } from "console";
import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/classroom:
 *  post:
 *   description: 获取某一时间段内可用的教室
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        week:
 *         type: number
 *         description: 周次
 *         example: 1
 *        day_of_week:
 *         type: number
 *         description: 星期几
 *         example: 1
 *        start:
 *         type: number
 *         description: 第几节课开始
 *         example: 1
 *        end:
 *         type: number
 *         description: 第几节课结束
 *         example: 2
 *   responses:
 *    200:
 *     description: Success
 */
export async function POST(req: NextRequest) {
	var data: {
		week: number;
		day_of_week: number;
		start: number;
		end: number;
	};

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
			week: z.number(),
			day_of_week: z.number(),
			start: z.number(),
			end: z.number(),
		}).parse(data);

		const available = await prisma.location.findMany({
			where: {
				NOT: {
					timeBlock: {
						some: {
							AND: {
								week_end: {
									gte: data.week,
								},
								week_start: {
									lte: data.week,
								},
								day_of_week: {
									equals: data.day_of_week,
								},
								start: {
									lte: data.start,
								},
								end: {
									gte: data.end,
								},
							},
						},
					},
				},
			},
			include: {
				timeBlock: true,
			},
		});
		return Response.json({
			msg: "success",
			data: available.map((location) => {
                return {
                    name: location.name,
                    address: location.address,
                }
            })
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "invalid data",
		});
	}
}
