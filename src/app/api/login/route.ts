import prisma, { redis } from "@/app/db";
import { encryptPassword } from "@/util";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
//   try {
//     await redis.connect();
//     const userId = await redis.get(req.headers.get("cookie")!!.split("=")[1]);
//     await redis.disconnect();
//     if (userId) {
//       return NextResponse.next();
//     }
//     return NextResponse.redirect(new URL("/api/login", req.url),{
//       status: 401,
//       headers: {
//         "Set-Cookie": `token=${randomUUID()}; Max-Age=60;`,
//       },
//     });
//   } catch (error) {
//     return Response.json(
//       {
//         msg: "error",
//         error: error,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
console.log(req.headers.get("x-redirect-referrer"));
const response = NextResponse.json({
	msg: "success",
	data: "login success",
});
response.cookies.set("token", randomUUID(), {
	httpOnly: true,
	maxAge: 60,
});
return response;
}

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
		await redis.connect();
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
		var account: {
			id: number;
			account: string;
			password: string;
			userId: number;
		} | null;
		try {
			account = await prisma.account.findUnique({
				where: {
					account: data.account,
				},
			});
		} catch (error) {
			return Response.json({
				msg: "error",
				error: error,
			});
		}

		if (!account) {
			return Response.json({
				msg: "error",
				error: "account not found",
			});
		} else if (encryptPassword(data.password) !== account.password) {
			return Response.json({
				msg: "error",
				error: "password not match",
			});
		}

		if (req.headers.get("cookie") != null) {
			try {
				await redis.set(
					req.headers.get("cookie")!!.split("=")[1],
					account.account.toString(),
					{
						EX: 5,
					}
				);
				return Response.json({
					msg: "success",
					data: "login success",
				});
			} catch (error) {
				return Response.json({
					msg: "redis error",
					error: error,
					token: req.headers.get("cookie")!!.split("=")[1],
				});
			}
		} else {
			const token = randomUUID();

			return Response.json(
				{
					msg: "success",
					data: "login success",
				},
				{
					headers: {
						"Set-Cookie": `token=${token}`,
					},
				}
			);
		}
	} catch (error) {
		return Response.json({
			msg: "error",
			error: error,
			data: data,
		});
	} finally {
		await redis.disconnect();
	}
}
