"use client";

import { useState } from "react";

type VisualSpecResult = {
  sketchId?: string;
  spec?: unknown;
  error?: string;
};

type BuildResult = {
  ok?: boolean;
  url?: string;
  error?: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [result, setResult] = useState<VisualSpecResult | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setGeneratedUrl(null);

      const body = new FormData();
      body.append("image", file);

      const response = await fetch("/api/spec", {
        method: "POST",
        body,
      });

      const data: VisualSpecResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to analyze image");
      }

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unknown analyze error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function build() {
    if (!result?.spec) return;

    try {
      setBuilding(true);
      setError(null);
      setGeneratedUrl(null);

      const response = await fetch("/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spec: result.spec,
        }),
      });

      const data: BuildResult = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Failed to build");
      }

      // Cache busting
      setGeneratedUrl(`${data.url}?t=${Date.now()}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unknown build error"
      );
    } finally {
      setBuilding(false);
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const nextFile = event.target.files?.[0];

    if (!nextFile) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));

    setResult(null);
    setGeneratedUrl(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-white p-8 text-black">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-5xl font-black tracking-tight">
          RED PEN
        </h1>

        <p className="mt-2 text-xl">
          Imagination → Software
        </p>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-8 border border-red-500 bg-red-50 p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* 1. Sketch */}
        <section className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              1. YOUR IDEA
            </h2>

            {file && (
              <span className="text-xs text-gray-500">
                {file.name}
              </span>
            )}
          </div>

          <div className="flex min-h-[420px] flex-col border border-gray-300 p-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview ? (
              <div className="mt-4 flex flex-1 items-center justify-center">
                <img
                  src={preview}
                  alt="Uploaded sketch"
                  className="max-h-[360px] max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-center text-gray-400">
                Upload a sketch,
                <br />
                drawing, or concept image.
              </div>
            )}
          </div>

          <button
            onClick={analyze}
            disabled={!file || loading || building}
            className="mt-4 bg-black px-8 py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading
              ? "UNDERSTANDING..."
              : "ANALYZE IDEA"}
          </button>
        </section>

        {/* 2. VisualSpec */}
        <section className="flex flex-col">
          <div className="mb-3">
            <h2 className="text-lg font-bold">
              2. VISUAL SPEC
            </h2>
          </div>

          <div className="min-h-[420px] flex-1 overflow-auto border border-gray-300 bg-gray-50 p-4">
            {result?.spec ? (
              <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                {JSON.stringify(result.spec, null, 2)}
              </pre>
            ) : (
              <div className="flex h-full min-h-[380px] items-center justify-center text-center text-gray-400">
                AI interpretation
                <br />
                will appear here.
              </div>
            )}
          </div>

          <button
            onClick={build}
            disabled={!result?.spec || building || loading}
            className="mt-4 bg-red-600 px-8 py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            {building
              ? "MAKING IT REAL..."
              : "MAKE IT REAL"}
          </button>
        </section>

        {/* 3. Generated Software */}
        <section className="flex flex-col">
          <div className="mb-3">
            <h2 className="text-lg font-bold">
              3. MADE REAL
            </h2>
          </div>

          <div className="min-h-[420px] flex-1 overflow-hidden border border-gray-300">
            {generatedUrl ? (
              <iframe
                key={generatedUrl}
                src={generatedUrl}
                title="Generated RED PEN experience"
                className="h-full min-h-[600px] w-full bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center text-center text-gray-400">
                Your generated experience
                <br />
                will appear here.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t pt-6">
        <p className="text-sm font-medium">
          DRAW IT. MAKE IT REAL.
        </p>
      </footer>
    </main>
  );
}