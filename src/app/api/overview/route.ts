export function GET(req: Request) {
    return Response.json({
        msg: "success",
        data: "hello world",
    });
}