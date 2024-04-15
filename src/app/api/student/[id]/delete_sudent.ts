import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function DELETE(
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
		await prisma.student.delete({
			where: {
				id: Number(params.id),
			},
		});
		return Response.json({
			msg: "success",
			data: "student deleted",
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "student not found",
		});
	}
}