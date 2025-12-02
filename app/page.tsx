"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PromptPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    localStorage.setItem("workout", JSON.stringify(data));

    setLoading(false);
    router.push("/workout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smarter training starts here
          </h1>
          <p className="text-xl text-gray-600">
            Chat with AI to build custom fitness plans
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: a 6-week full-body strength program for an intermediate lifter"
              className="min-h-[150px] text-base resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-400">
                {prompt.length}/1000
              </span>
              <Button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="rounded-full w-14 h-14 p-0 bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
