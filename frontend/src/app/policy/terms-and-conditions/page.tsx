import { Footer } from "@/components/blocks/footer-section";


export default function TermsAndConditionsPage() {
    return (
        <>
            <div className="max-w-3xl mx-auto px-6 py-12">

                <h1 className="text-4xl font-bold mb-6">
                    Terms & Conditions
                </h1>

                <p className="mb-6 text-muted-foreground">
                    Welcome to Zuplin. By accessing or using our platform, you agree to the following terms:
                </p>

                <div className="space-y-6 [&_strong]:font-semibold [&_strong]:text-foreground">

                    <div className="space-y-2">
                        <p><strong>Use of Service</strong></p>
                        <p>
                            Zuplin provides a customer retention and loyalty platform for businesses.
                            You agree to use the platform only for lawful business purposes.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Account Responsibility</strong></p>
                        <p>
                            You are responsible for maintaining the confidentiality of your account
                            credentials and all activities under your account.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Service Availability</strong></p>
                        <p>
                            We strive to provide uninterrupted service but do not guarantee that
                            the platform will always be available or error-free.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Payments & Subscription</strong></p>
                        <ul className="list-disc pl-6">
                            <li>Zuplin operates on a subscription + usage-based model</li>
                            <li>Fees must be paid as per the selected plan</li>
                            <li>Failure to pay may result in service suspension</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Messaging Usage</strong></p>
                        <p>
                            Businesses are responsible for ensuring that customer communication
                            complies with applicable laws, including WhatsApp and SMS guidelines.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Limitation of Liability</strong></p>
                        <p>
                            Zuplin is not liable for any indirect, incidental, or consequential
                            damages arising from the use of the platform.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Changes to Terms</strong></p>
                        <p>
                            We may update these terms from time to time. Continued use of the
                            platform constitutes acceptance of the updated terms.
                        </p>
                    </div>

                </div>




            </div>
            <Footer />
        </>
    );
}