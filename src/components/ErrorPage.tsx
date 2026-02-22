import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = "Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status} ${error.statusText}`;
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.status === 404) {
      errorMessage = "Page not found";
    } else if (error.status === 500) {
      errorMessage = "Internal server error";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-black">
      <div className="max-w-md w-full mx-4 text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <AlertTriangle className="w-20 h-20 text-orange-500" />
        </div>

        {/* Error Title */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold text-orange-500">{errorStatus}</h2>
        </div>

        {/* Error Message */}
        <p className="text-lg text-slate-300">{errorMessage}</p>

        {/* Description */}
        <p className="text-slate-400">
          Something went wrong. Don't worry, our team is looking into it.
        </p>

        {/* Action Button */}
        <Button
          onClick={() => window.location.href = "/"}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-5 h-5" />
          Go to Home
        </Button>

        {/* Additional Help */}
        <div className="pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-500">
            Need help? <a href="/contact" className="text-orange-500 hover:text-orange-400">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
