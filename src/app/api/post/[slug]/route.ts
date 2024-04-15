import prisma, { redis }   from "@/app/db";
import { randomUUID } from "crypto";
import { get } from "http";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { number, z } from "zod";

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
){
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (request.headers.get("cookie") == null) {
        return Response.json({
            msg: "error",
            error: "token not found"
        }, {
            status: 401,
            headers: {
                "Set-Cookie": `token=${randomUUID()}`
            }
        })
    } else {
        await redis.connect();
    }
    if (Number.isNaN(Number(params.slug))) {
        return Response.json({
            msg: "error",
            error: "slug must be a number"
        })
    }
    
    try {
        await redis.connect();
        var data_redis = await redis.get(params.slug.toString());
        if(data_redis){
            return Response.json(
                {
                    msg: "success",
                    data: JSON.parse(data_redis),
                    from: "redis"
                }
            )
        }
        const data = await prisma.post.findFirstOrThrow({
            where: {
                id: Number(params.slug)
            },
            select: {
                author: {
                    select: {
                        name: true
                    }
                },
                title: true,
                description: true,
                content: true
            }
        })
        await redis.set(params.slug.toString(), JSON.stringify(data), {
            EX: 60 * 60,
        });
        return Response.json(
        {
            msg: "success",
            data: data,
            from: "database",
        }
    )
    } catch (error) {
        return Response.json({
            msg: "error",
            error: error
        })
    } finally {
        await redis.disconnect();
    }
}