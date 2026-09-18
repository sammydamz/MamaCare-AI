// ponytail: SSE fan-out for live dashboard updates. Single-process broadcast
// is enough on one Railway replica — add Redis pub/sub only past 1 replica.
type SSEClient = { res: any };

const clients = new Set<SSEClient>();

export function subscribeSSE(res: any): () => void {
  const client = { res };
  clients.add(client);
  return () => {
    clients.delete(client);
  };
}

// Event is intentionally payload-free ('changed'): clients refetch the
// bounded list endpoint instead of us duplicating row-mapping here.
export function publishSSE(event: string, data: unknown = {}) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      clients.delete(client);
    }
  });
}
