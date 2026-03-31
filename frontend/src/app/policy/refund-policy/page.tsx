import { Footer } from "@/components/blocks/footer-section";


export default function RefundPolicyPage() {
    return (
        <>
            <div className="max-w-3xl mx-auto px-6 py-12 h-[70%]">

                <h1 className="text-4xl font-bold mb-6">
                    Refund Policy
                </h1>

                <p className="mb-6 text-muted-foreground">
                    This Refund Policy outlines the terms under which refunds may be issued
                    for services provided by Zuplin.
                </p>

                <div className="space-y-6 [&_strong]:font-semibold [&_strong]:text-foreground">

                    <div className="space-y-2">
                        <p><strong>Subscription Fees</strong></p>
                        <p>
                            All subscription payments are non-refundable, except in cases of
                            proven billing errors.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Usage-Based Charges</strong></p>
                        <p>
                            Charges related to messaging (coins) are non-refundable once they
                            have been consumed.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Exceptional Cases</strong></p>
                        <p>
                            Refunds may be considered on a case-by-case basis at Zuplin’s
                            discretion.
                        </p>
                    </div>

                </div>



            </div>
            <Footer />
        </>
    );
}