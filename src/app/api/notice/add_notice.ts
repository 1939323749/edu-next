import prisma from "@/app/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function addNotice(
    req: NextRequest
) {
    var data: {
        title: string;
        content: string;
    }

    try {
        data = await req.json();
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }

    try {
        z.object({
            title: z.string(),
            content: z.string(),
        }).parse(data);
        return Response.json({
            msg: "success",
            data: await prisma.notice.create({
                data: {
                    title: data.title,
                    content: data.content,
                }
            }),
        });

    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
        });
    }
}