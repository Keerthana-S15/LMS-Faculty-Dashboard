import { useNavigate } from "react-router-dom";
import { LogOut, X, ShieldCheck } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SecondaryButton, InlineAlert } from "../components/ui";

export default function Logout() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard > Logout"
        title="Logout"
        subtitle="You are about to logout from your account"
      />

      <Card className="max-w-xl p-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-brand-50 ring-8 ring-brand-50/60 flex items-center justify-center mb-5">
          <LogOut size={30} className="text-brand-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Are you sure you want to logout?</h2>
        <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
          You will be logged out of your account and need to login again to continue.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <SecondaryButton icon={X} onClick={() => navigate(-1)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton icon={LogOut} onClick={() => navigate("/")}>
            Yes, Logout
          </PrimaryButton>
        </div>
      </Card>

      <InlineAlert icon={ShieldCheck} className="max-w-xl mt-4">
        For your security, please make sure to logout when you are done using the system.
      </InlineAlert>
    </div>
  );
}
