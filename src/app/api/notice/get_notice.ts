import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function getNotice(req: NextRequest) {
    return Response.json({
        msg: "success",
        data: await prisma.notice.findMany({
            select: {   
                id: true,
                title: true,
                content: true,
                createdAt: true,
            }
        }),
    });
}