import { useEffect, useState } from "react";
import PageLayout from "./page-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ListFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [quoteType, setQuoteType] = useState<"single" | "double">("single");
  const [wrapperType, setWrapperType] = useState<
    "none" | "parens" | "braces" | "brackets"
  >("none");

  // Debounce input updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300); // 300ms delay

    return () => clearTimeout(handler);
  }, [input]);

  // Convert when debounced input changes
  useEffect(() => {
    const quote = quoteType === "single" ? "'" : '"';
    const items = debouncedInput
      .split(/\s+/)
      .filter(Boolean)
      .map((item) => `${quote}${item}${quote}`)
      .join(", ");

    let wrapped = items;
    if (wrapperType === "parens") wrapped = `(${items})`;
    if (wrapperType === "braces") wrapped = `{${items}}`;
    if (wrapperType === "brackets") wrapped = `[${items}]`;

    setOutput(wrapped);
  }, [debouncedInput, quoteType, wrapperType]);

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-6 w-full">
      {/* Left side: Input */}
      <Card className="flex flex-col shadow">
        <CardHeader>
          <CardTitle>Paste or type</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <Textarea
            placeholder="Paste your data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          />
        </CardContent>
      </Card>

      {/* Right side: Output */}
      <Card className="flex flex-col shadow">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <div className="flex items-center gap-4">
            <Select
              value={quoteType}
              onValueChange={(v) => setQuoteType(v as "single" | "double")}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Quote Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single quotes</SelectItem>
                <SelectItem value="double">Double quotes</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={wrapperType}
              onValueChange={(v) => setWrapperType(v as typeof wrapperType)}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Wrapper" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="parens">Parentheses ( )</SelectItem>
                <SelectItem value="braces">Braces {`{ }`}</SelectItem>
                <SelectItem value="brackets">Brackets [ ]</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <Textarea
            value={output}
            readOnly
            className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          />
          <Button onClick={handleCopy}>Copy</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Arr01() {
  return (
    <PageLayout title="Arr format">
      <ListFormatter />
    </PageLayout>
  );
}
