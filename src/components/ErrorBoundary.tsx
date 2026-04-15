import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = `Database Error: ${parsed.error}`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-primary">Something went wrong</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            {errorMessage}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
