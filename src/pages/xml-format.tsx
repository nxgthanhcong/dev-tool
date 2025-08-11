// @ts-nocheck
import PageLayout from "./page-layout";
import { useEffect, useState } from "react";
import xmlFormatter from "xml-formatter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import CopyIcon from "@/components/icons/copy";
import ParticleButton from "@/components/kokonutui/particle-button";

function XMLTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [indentSize, setIndentSize] = useState(2);
  const [auto, setAuto] = useState(true);
  const [debounced, setDebounced] = useState(input);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    if (auto) formatNow();
  }, [debounced, indentSize, auto]);

  function formatNow() {
    setError(null);
    if (!debounced.trim()) {
      setOutput("");
      return;
    }

    try {
      const formatted = xmlFormatter(debounced, {
        indentation: " ".repeat(indentSize),
        collapseContent: false,
      });

      var formatedLv2 = minifyLeafNodes(formatted);

      setOutput(formatedLv2);
    } catch (e) {
      setError(e.message || "Invalid XML");
      setOutput("");
    }
  }

  function minifyLeafNodes(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    function processNode(node) {
      for (let child of node.children) {
        if (child.children.length === 0) {
          // Leaf node — trim text content
          child.textContent = child.textContent.trim();
        } else {
          // Not a leaf — go deeper
          processNode(child);
        }
      }
    }

    processNode(xmlDoc.documentElement);

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch { }
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="grid grid-cols-2 gap-4 min-h-[70vh] mt-6"
    >
      {/* Input Panel */}
      <ResizablePanel defaultSize={30}>
        <Card className="flex flex-col h-full bg-sidebar">
          <CardContent className="flex flex-col flex-grow p-0">
            <Textarea
              placeholder={`Example:
<root>
  <child attr="1">Value</child>
</root>`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-input2 flex-grow font-mono h-[320px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            />
            {error && (
              <div className="text-sm text-red-600 mt-2 p-2">Error: {error}</div>
            )}
          </CardContent>
        </Card>
      </ResizablePanel>

      <ResizableHandle />

      {/* Output Panel */}
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={100} className="border-none">
            <Card className="flex flex-col h-full bg-transparent border-none">
              {/* <CardContent className="flex flex-col gap-3 flex-grow p-0">
                <Textarea
                  readOnly
                  value={output}
                  className="bg-sidebar flex-grow font-mono focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button onClick={formatNow}>Format</Button>
                  <Button onClick={handleCopy}>Copy</Button>
                </div>
              </CardContent> */}
              <CardContent className="flex flex-col gap-3 flex-1 p-0 relative">
                <Textarea
                  value={output}
                  readOnly
                  className="flex-grow bg-sidebar focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                />
                <ParticleButton onClick={handleCopy} className="absolute right-8 bottom-8">
                  {/* <CopyIcon /> */}
                </ParticleButton>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default function XMLFormatPage() {
  return (
    <PageLayout title="XML Formatter">
      <XMLTool />
    </PageLayout>
  );
}
