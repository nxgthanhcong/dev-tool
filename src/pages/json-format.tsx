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
    } catch {}
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="grid grid-cols-2 gap-4 p-4 min-h-[80vh]"
    >
      <ResizablePanel defaultSize={30}>
        {/* Left - input */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Input (paste JS / object / JSON)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 flex-grow">
            <Textarea
              placeholder={`Examples:
                { a:1, b:2, }
                [1,2,3,]
                name: "John", age:30
                function f(){return {x:1}}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow font-mono min-h-[320px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            />
            <div className="flex justify-between items-center gap-4">
              {/* <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
              />
              Auto
            </label> */}
              {/* <label className="flex items-center gap-2 select-none">
              Indent:
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="border rounded px-2 py-1 ml-1"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
            </label> */}
              {/* <label
              className="flex items-center gap-2 cursor-pointer select-none"
              title="Unsafe eval can run code. Use carefully!"
            >
              <input
                type="checkbox"
                checked={allowUnsafeEval}
                onChange={(e) => setAllowUnsafeEval(e.target.checked)}
              />
              Unsafe Eval
            </label> */}
              {/* <label
              className="flex items-center gap-2 cursor-pointer select-none"
              title="Use Prettier for output formatting"
            >
              <input
                type="checkbox"
                checked={usePrettier}
                onChange={(e) => setUsePrettier(e.target.checked)}
              />
              Prettier
            </label> */}
              {/* <Button onClick={formatNow} disabled={auto}>
              Format
            </Button> */}
              {/* <Button
              variant="outline"
              onClick={() => {
                setInput("");
                setOutput("");
                setError(null);
              }}
            >
              Clear
            </Button> */}
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
          <ResizablePanel defaultSize={100}>
            {/* Right - output */}
            <Card className="flex flex-col h-full">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Formatted Output</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 flex-grow">
                <Textarea
                  readOnly
                  value={output}
                  className="min-h-[320px] font-mono flex-grow focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                />
                <Button onClick={handleCopy}>Copy</Button>
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizableHandle />
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
    // <div className="grid grid-cols-2 gap-4 p-4 min-h-[80vh]">

    // </div>
  );
}

export default function JsonFormatPage() {
  return (
    <PageLayout title="Json format on fail">
      <JSTool />
    </PageLayout>
  );
}
