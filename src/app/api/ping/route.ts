import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/ping:
 *  get:
 *   summary: Ping API
 *   parameters: []
 *   responses:
 *    200:
 *      description: Success
 */
export function GET(req: NextRequest, res: Response){
    return Response.json({
        msg: "success",
        data: "pong",
    });
}