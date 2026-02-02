import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

// Lazy-loaded so Next.js build doesn't try to read proto file (which may not exist at build time)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let queryServiceClient: any = null;

function getClient() {
  if (queryServiceClient) return queryServiceClient;

  const protoPath =
    process.env.QUERY_SERVICE_PROTO_PATH ||
    path.resolve(
      process.cwd(),
      "../QueryService/src/main/proto/queryservice.proto",
    );
  const includeDirs = [
    path.join(process.cwd(), "node_modules", "google-proto-files"),
    path.dirname(protoPath),
  ];
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs,
  });
  const pkg = grpc.loadPackageDefinition(packageDefinition) as unknown as {
    queryservice: { QueryService: new (t: string, c: grpc.ChannelCredentials) => unknown };
  };
  const target = process.env.QUERY_SERVICE_GRPC_TARGET ?? "localhost:9090";
  queryServiceClient = new pkg.queryservice.QueryService(
    target,
    grpc.credentials.createInsecure(),
  );
  return queryServiceClient;
}

function unaryCall<TRequest, TResponse>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  method: any,
  request: TRequest,
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    method.call(client, request, (err: Error, resp: TResponse) => {
      if (err) reject(err);
      else resolve(resp);
    });
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json(
      { error: "tenantId is required" },
      { status: 400 },
    );
  }

  try {
    const client = getClient();
    const tenantRequest = { tenantId };

    const [cpuRes, ramRes, diskRes] = await Promise.all([
      unaryCall<any, { metrics: { ts: string; value: number; hostId: string }[] }>(
        client,
        client.getDashboardCpu,
        tenantRequest,
      ),
      unaryCall<any, { metrics: { ts: string; value: number; hostId: string }[] }>(
        client,
        client.getDashboardRam,
        tenantRequest,
      ),
      unaryCall<any, { metrics: { ts: string; value: number; hostId: string }[] }>(
        client,
        client.getDashboardDisk,
        tenantRequest,
      ),
    ]);

    const cpu = cpuRes.metrics ?? [];
    const ram = ramRes.metrics ?? [];
    const disk = diskRes.metrics ?? [];

    return NextResponse.json({ cpu, ram, disk });
  } catch (error) {
    console.error("gRPC dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics via gRPC" },
      { status: 500 },
    );
  }
}

