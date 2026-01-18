import Link from "next/link";
import { Rocket, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <Rocket className="h-10 w-10 text-blue-400 animate-float" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Lost in Space
          </h2>
          <p className="text-gray-400 mb-6">
            The page you&apos;re looking for has drifted into the void.
            Let&apos;s get you back to mission control.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
