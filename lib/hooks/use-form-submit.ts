"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface Options {
  url: string;
  method: "POST" | "PATCH";
  successMessage: string;
  redirectTo: string;
}

/**
 * Handles the fetch → toast → redirect pattern shared by all admin forms.
 * Returns `saving` state and a `submit(data)` function to call from onSubmit.
 */
export function useFormSubmit({ url, method, successMessage, redirectTo }: Options) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const submit = async (data: unknown) => {
    setSaving(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      toast({ title: successMessage });
      router.push(redirectTo);
      router.refresh();
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return { saving, submit };
}
