import { ElasticSwitch } from "@/components/ui/elastic-switch-shadcnui";

export function LoyaltyHeader() {
    return (
        <div className="flex items-start justify-between mb-4">
            <div>
                <h2 className="text-2xl font-semibold mb-4">Loyalty Campaign</h2>
                <p className="text-muted-foreground mb-6">Engage your customers and boost retention with our loyalty campaign features.</p>
            </div>
            <ElasticSwitch />
        </div>
    )
}