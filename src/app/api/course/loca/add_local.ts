import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { start } from "repl";
import { z } from "zod";

export async function POST(req: NextRequest) {
	var data: {
		course_id: number;
		loca_id: number;
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
			course_id: z.number(),
			loca_id: z.number(),
		}).parse(data);

		const course_tb = await prisma.course.update({
			where: {
				id: data.course_id,
			},
			data: {
				locations: {
					connect: {
						id: data.loca_id,
					},
				},
			},
			include: {
				locations: true,
			},
		});

		return Response.json({
			msg: "success",
			data: course_tb,
		});
	} catch (error) {
		return Response.json(
			{
				msg: "error",
				error: error,
			},
			{
				status: 500,
			}
		);
	}
}
