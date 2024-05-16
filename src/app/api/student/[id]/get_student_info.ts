import prisma from "@/app/db";
import email from "next-auth/providers/email";
import { NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	if (!Number(params.id)) {
		return Response.json({
			msg: "error",
			error: "invalid id",
		});
	}
	try {
		const student = await prisma.student.findUniqueOrThrow({
			where: {
				id: Number(params.id),
			},
			select: {
				id: true,
				name: true,
				sex: true,
				email: true,
				class: {
					select: {
						name: true,
					},
				},
				enrolled_time: true,
				graduated_time: true,
				major: {
					select: {
						name: true,
						departments: {
							select: {
								name: true,
							},
						},
					},
				},
			}
		});
		return Response.json({
			msg: "success",
			data: student,
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "student not found",
		});
	}
}