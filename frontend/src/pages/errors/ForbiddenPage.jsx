import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Access Forbidden
        </h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource.
        </p>
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
