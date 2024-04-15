import prisma from "@/app/db";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    if (!Number(params.id)) {
      return Response.json({
        msg: "error",
        error: "invalid id",
      });
    }
    try {
        const teacher = await prisma.teacher.findUniqueOrThrow({
            where: {
            id: Number(params.id),
            },
            select: {
            id: true,
            name: true,
            title: true,
            email: true,
            }
        });
        return Response.json({
            msg: "success",
            data: teacher,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "teacher not found",
            details: error
        });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    var data: {
        name: string;
        title: string;
        email: string;
    };
    try {
        data = await request.json();
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid json format",
        });
    }
    try {
        const teacher = await prisma.teacher.update({
            where: {
                id: Number(params.id),
            },
            data: {
                name: data.name,
                title: data.title,
                email: data.email,
            },
        });
        return Response.json({
            msg: "success",
            data: {
                id: teacher.id,
                name: teacher.name,
                title: teacher.title,
                email: teacher.email,
            },
            updated_at: teacher.updatedAt,
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "invalid data",
            details: error
        });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.teacher.delete({
            where: {
                id: Number(params.id),
            },
        });
        return Response.json({
            msg: "success",
            data: "teacher deleted",
        });
    } catch (error) {
        return Response.json({
            msg: "error",
            error: "teacher not found",
            details: error
        });
    }
}
