// import { randomUUID } from "crypto";
// import prisma from "../db";
// import { number, z } from "zod";
// import { NextRequest, NextResponse } from "next/server";
// import { auth, clerkClient } from "@clerk/nextjs";

import { NextRequest } from "next/server";
import prisma from "../db";
import { revalidatePath, revalidateTag } from "next/cache";

// export async function GET(req: NextRequest) {
// 	const { userId, getToken } = auth();

// 	if (!userId) {
// 		return new Response("Unauthorized", { status: 401 });
// 	}

// 	try {
// 		const token = await getToken({ template: "edu-next" });

// 		// Add logic here to fetch data from Supabase and return it.

// 		const data = { supabaseData: "Hello World" };

// 		return Response.json({ data });
// 	} catch (error) {
// 		return Response.json(error);
// 	}
// }

// export async function POST(req:NextRequest) {
//     const { userId } = auth();
   
//     if (!userId) return NextResponse.redirect(new URL('/sign-in',req.url));
    
//     const params = { firstName: 'John', lastName: 'Wick' };
   
//     const user = await clerkClient.users.updateUser(userId, params);
   
//     return NextResponse.json({ user });
//   }
   
export async function GET(req: NextRequest) {
    const data = await prisma.$queryRaw`SELECT * FROM course`

    return Response.json({
        data: data
    });
}