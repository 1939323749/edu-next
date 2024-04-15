import prisma from "@/app/db";
import { teal } from "@mui/material/colors";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return Response.json({
        msg: "success",
        data: await prisma.class.findMany({
            select: {
                id: true,
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        students: true
                    }
                },
                courses: {
                    select: {
                        name: true,
                    }
                }
            }
        }),
    });
}