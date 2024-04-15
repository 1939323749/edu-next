import prisma from "@/app/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sort = req.nextUrl.searchParams.get("sort");
    if (sort === "desc") {
      return Response.json({
        msg: "success",
        data: await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                description: true,
                author: {
                    select: {
                        name: true,
                        email : true
                    }
                }
            },
            orderBy: {
                id: "desc"
            }
        }),
        }) 
    }
    return Response.json({
      msg: "success",
      data: await prisma.post.findMany({
        include: {
            author: true
        }
      }),
    });
  } catch (error) {
    return Response.json(error);
  }
}
