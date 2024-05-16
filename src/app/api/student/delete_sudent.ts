import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function deleteStudent(
	req: NextRequest,
) {
	var data: {
		student_id: number,
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
		await prisma.student.findUniqueOrThrow({
			where: {
				id: data.student_id,
			},
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "student not found",
		});
	}

	try {
		await prisma.student.delete({
			where: {
				id: data.student_id,
			},
		});
	} catch (error) {
		return Response.json({
			msg: "error",
			error: "delete student failed",
		});
	}
}