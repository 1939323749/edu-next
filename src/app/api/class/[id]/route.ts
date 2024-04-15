import prisma from "@/app/db";
import { NextRequest } from "next/server";

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
		data: await prisma.class.findMany({
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
