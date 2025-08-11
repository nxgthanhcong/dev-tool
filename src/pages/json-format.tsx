// @ts-nocheck

import PageLayout from "./page-layout";

// src/pages/JSTool.tsx
import { useEffect, useState } from "react";
import * as esprima from "esprima";
import * as escodegen from "escodegen";
import JSON5 from "json5";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import CopyIcon from "@/components/icons/copy";
import ParticleButton from "@/components/kokonutui/particle-button";

function JSTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [auto, setAuto] = useState(true);
  const [debounced, setDebounced] = useState(input);
  const [error, setError] = useState(null);
  const [indentSize, setIndentSize] = useState(2);
  const [usePrettier, setUsePrettier] = useState(false);
  const [allowUnsafeEval, setAllowUnsafeEval] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    if (auto) formatNow();
  }, [debounced, auto, indentSize, usePrettier, allowUnsafeEval]);

  function repairSimple(raw) {
    let s = raw.replace(/,\s*([\]\}])/g, "$1");
    const open = (s.match(/\{/g) || []).length;
    const close = (s.match(/\}/g) || []).length;
    if (open > close) s = s + "}".repeat(open - close);
    return s;
  }

  function tryParseStrategies(src) {
    const errors = [];

    // 1. JSON parse
    try {
      return { type: "json", value: JSON.parse(src) };
    } catch (e) {
      errors.push(e);
    }

    // 2. JSON5 parse
    try {
      return { type: "json5", value: JSON5.parse(src) };
    } catch (e) {
      errors.push(e);
    }

    // 3. esprima parse as-is
    try {
      const ast = esprima.parseScript(src, { tolerant: true, jsx: true });
      return { type: "esprima", ast };
    } catch (e) {
      errors.push(e);
    }

    // 4. esprima parse wrapped in parentheses
    try {
      const ast = esprima.parseScript(`(${src})`, {
        tolerant: true,
        jsx: true,
      });
      return { type: "esprimaWrapped", ast };
    } catch (e) {
      errors.push(e);
    }

    // 5. repair simple then parse
    try {
      const repaired = repairSimple(src);
      const ast = esprima.parseScript(repaired, { tolerant: true, jsx: true });
      return { type: "esprimaRepaired", ast };
    } catch (e) {
      errors.push(e);
    }

    // 6. unsafe eval if allowed
    if (allowUnsafeEval) {
      try {
        const fn = new Function(`return (${src})`);
        const value = fn();
        return { type: "eval", value };
      } catch (e) {
        errors.push(e);
      }
    }

    throw errors[errors.length - 1] || new Error("Cannot parse input");
  }

  function generateCodeFromAst(ast) {
    try {
      const full = escodegen.generate(ast, {
        format: {
          indent: {
            style: " ".repeat(indentSize),
            base: 0,
          },
          newline: "\n",
          semicolons: true,
        },
        comment: false,
      });
      if (full.startsWith("var __tmp =")) {
        return full.replace(/^var __tmp =\s*/, "").replace(/;\s*$/, "");
      }
      return full;
    } catch (e) {
      throw e;
    }
  }

  function formatNow() {
    setError(null);
    if (!debounced.trim()) {
      setOutput("");
      return;
    }

    try {
      const res = tryParseStrategies(debounced);

      if (res.type === "json" || res.type === "json5" || res.type === "eval") {
        // output JSON pretty
        const s = JSON.stringify(res.value, null, indentSize);
        setOutput(usePrettier ? prettier.format(s, { parser: "json" }) : s);
        return;
      }

      // esprima AST
      if (
        res.type === "esprima" ||
        res.type === "esprimaWrapped" ||
        res.type === "esprimaRepaired"
      ) {
        // try convert top-level object/array expression to JSON for nicer output
        const ast = res.ast;
        if (
          ast.type === "Program" &&
          ast.body.length === 1 &&
          ast.body[0].type === "ExpressionStatement" &&
          (ast.body[0].expression.type === "ObjectExpression" ||
            ast.body[0].expression.type === "ArrayExpression")
        ) {
          // generate code from expression
          const exprCode = escodegen.generate(ast.body[0].expression);
          let val;
          try {
            val = Function(`"use strict";return (${exprCode});`)();
            const s = JSON.stringify(val, null, indentSize);
            setOutput(usePrettier ? prettier.format(s, { parser: "json" }) : s);
            return;
          } catch {
            // fallback to code gen
          }
        }
        // fallback to js codegen
        const code = generateCodeFromAst(ast);
        setOutput(
          usePrettier
            ? prettier.format(code, { parser: "babel", plugins: [parserBabel] })
            : code
        );
        return;
      }
    } catch (e) {
      setOutput("");
      setError(e.message || "Unknown error");
    }
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch { }
  }

  function syntaxHighlightJson(jsonString) {
    // Escape HTML entities
    const safeJson = jsonString
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Add color to keys, strings, numbers, booleans, null
    return safeJson.replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            // Key
            return `<span style="color:#ffb74d">${match}</span>`;
          } else {
            // String value
            return `<span style="color:white">${match}</span>`;
          }
        } else if (/true|false/.test(match)) {
          return `<span style="color:#ffb86c">${match}</span>`; // Boolean
        } else if (/null/.test(match)) {
          return `<span style="color:#8be9fd">${match}</span>`; // Null
        } else {
          return `<span style="color:#bd93f9">${match}</span>`; // Number
        }
      }
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="grid grid-cols-2 gap-4 min-h-[70vh] mt-6"
    >
      <ResizablePanel defaultSize={30}>
        {/* Left - input */}
        <Card className="flex flex-col h-full bg-sidebar ">
          <CardContent className="flex flex-col gap-0 flex-grow p-0">
            <Textarea
              placeholder={`Examples:
                { a:1, b:2, }
                [1,2,3,]
                name: "John", age:30
                function f(){return {x:1}}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-input2 flex-grow font-mono h-[320px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            />
            <div className="flex justify-between items-center gap-4">
            </div>
            {error && (
              <div className="text-sm text-red-600 mt-2">Error: {error}</div>
            )}
          </CardContent>
        </Card>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={100} className="border-none">
            {/* Right - output */}
            <Card className="flex flex-col h-full bg-transparent border-none">
              <CardContent className="flex flex-col gap-3 flex-grow p-0 relative">
                <Textarea
                  readOnly
                  value={output}
                  className="bg-sidebar flex-grow font-mono flex-grow focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                />
                {/* <div
                  className="bg-sidebar flex-grow font-mono p-3 overflow-roll rounded"
                  style={{ whiteSpace: "pre" }}
                  dangerouslySetInnerHTML={{ __html: syntaxHighlightJson(output) }}
                /> */}
                <ParticleButton onClick={handleCopy} className="absolute right-8 bottom-8">
                  {/* <CopyIcon /> */}
                </ParticleButton>
                {/* <button onClick={handleCopy} className="flex gap-1 items-center select-none py-1 absolute right-8 top-2" aria-label="Copy">Copy</button> */}
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizableHandle />
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default function JsonFormatPage() {
  return (
    <PageLayout title="Json format on fail">
      <JSTool />
    </PageLayout>
  );
}
