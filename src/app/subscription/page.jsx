import SubscriptionPlans from "@/component/Subscription/SubscriptionPlans";
import { Suspense } from "react";
//import Subscription from "@/components/Subscription/Subscription";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading subscription...</div>}>
      <SubscriptionPlans />
    </Suspense>
  );
}
