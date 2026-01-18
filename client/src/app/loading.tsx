import { Rocket } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <p className="text-gray-400 text-sm">Loading mission data...</p>
      </div>
    </div>
  );
}
