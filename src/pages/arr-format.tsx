import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import PageLayout from "./page-layout";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="grid grid-cols-2 gap-4 min-h-[50vh] mt-6"
      >
        <ResizablePanel defaultSize={30}>
          {/* Left - input */}
          <Card className="flex flex-col shadow bg-transparent border-none h-full">
            <CardContent className="flex flex-col gap-4 flex-1 p-0">
              <Textarea
                placeholder="Paste your data here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-[320px] bg-input2 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={100} className="border-none">
              {/* Right - output */}
              <Card className="flex flex-col shadow bg-transparent h-full border-none">
                <CardHeader className="p-0">
                  {/* <CardTitle>Result</CardTitle> */}
                  <div className="flex items-center gap-4">
                    <Select
                      value={quoteType}
                      onValueChange={(v) => setQuoteType(v as "single" | "double")}
                    >
                      <SelectTrigger className="w-36 h-10 bg-sidebar">
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
                      <SelectTrigger className="w-36 h-10 bg-sidebar">
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
                <CardContent className="flex flex-col gap-3 flex-1 p-0 mt-4">
                  <Textarea
                    value={output}
                    readOnly
                    className="flex-grow bg-sidebar focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                  />
                  <Button onClick={handleCopy}>Copy</Button>
                </CardContent>
              </Card>
            </ResizablePanel>
            <ResizableHandle />
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default function Arr01() {
  return (
    <PageLayout title="Arr format">
      <ListFormatter />
    </PageLayout>
  );
}
