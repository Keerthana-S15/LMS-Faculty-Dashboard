import { useNavigate } from "react-router-dom";
import { LogOut, X, ShieldCheck } from "lucide-react";
import { Card } from "../components/ui";

export default function Logout() {
  const navigate = useNavigate();

  return (
    <div>
      <p className="text-xs text-brand-600 font-medium mb-1">Dashboard {">"} Logout</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Logout</h1>
      <p className="text-sm text-gray-500 mb-6">You are about to logout from your account</p>

      <Card className="max-w-xl p-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mb-5">
          <LogOut size={30} className="text-brand-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Are you sure you want to logout?</h2>
        <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
          You will be logged out of your account and need to login again to continue.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-5 py-2.5 rounded-xl"
          >
            <X size={15} /> Cancel
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl"
          >
            <LogOut size={15} /> Yes, Logout
          </button>
        </div>
      </Card>

      <div className="max-w-xl flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4 mt-4">
        <ShieldCheck size={18} className="text-brand-600 shrink-0 mt-0.5" />
        <p className="text-xs text-brand-700">
          For your security, please make sure to logout when you are done using the system.
        </p>
      </div>
    </div>
  );
}
