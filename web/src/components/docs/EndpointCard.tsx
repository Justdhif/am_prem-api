import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";

interface EndpointCardProps {
  method: "POST" | "GET";
  path: string;
  title: string;
  description: string;
  requestPayload?: string;
  curlSnippet?: string;
  responsePayload: string;
}

export function EndpointCard({
  method,
  path,
  title,
  description,
  requestPayload,
  curlSnippet,
  responsePayload,
}: EndpointCardProps) {
  return (
    <Card className="space-y-4">
      <CardHeader className="border-b border-gray-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant={method === "POST" ? "methodPost" : "methodGet"}>
            {method}
          </Badge>
          <code className="text-white font-mono text-sm sm:text-base font-bold">
            {path}
          </code>
        </div>
        <CardTitle className="text-sm sm:text-base text-gray-200 mt-2">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {requestPayload && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Request Body (JSON)
            </span>
            <CodeBlock code={requestPayload} curlSnippet={curlSnippet} />
          </div>
        )}

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Response Berhasil (200 OK)
          </span>
          <CodeBlock code={responsePayload} isSuccessResponse />
        </div>
      </CardContent>
    </Card>
  );
}
