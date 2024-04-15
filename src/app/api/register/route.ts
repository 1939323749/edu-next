import prisma from "@/app/db";
import { encryptPassword } from "@/util";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	var data: {
		account: string;
		password: string;
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
			account: z.string(),
			password: z.string(),
		}).parse(data);

		if (
			(data.account as string).length < 6 ||
			(data.password as string).length < 6
		) {
			return Response.json(
				{
					msg: "error",
					error: "account or password must be at least 6 characters",
				},
				{
					status: 400,
				}
			);
		}

		await prisma.account.create({
			data: {
				account: data.account,
				password: encryptPassword(data.password),
				user: {
					create: {
						name: data.account,
						email: data.account + "@example.com",
					},
				},
			},
		});
		return Response.json({
			msg: "register success",
			data: {
				name: data.account,
				email: data.account + "@example.com",
			},
		});
	} catch (error: any) {
		if (error.code === "P2002") {
			return Response.json(
				{
					msg: "error",
					error: "account already exists",
				},
				{
					status: 400,
				}
			);
		}

		return Response.json(
			{
				msg: "error",
				error: error,
			},
			{
				status: 400,
			}
		);
	}
}
