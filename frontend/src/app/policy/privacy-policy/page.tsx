import { Footer } from "@/components/blocks/footer-section";

export default function PrivacyPolicyPage() {
    return (
        <>
            <div className="max-w-3xl mx-auto px-6 py-12">

                <h1 className="text-4xl font-bold mb-6">
                    Privacy Policy
                </h1>

                <div className="space-y-6 [&_strong]:font-semibold [&_strong]:text-foreground">

                    <div className="space-y-2">
                        <p><strong>Introduction</strong></p>
                        <p>
                            Zuplin values your privacy and is committed to protecting your
                            personal data. This Privacy Policy explains how we collect,
                            use, and safeguard your information.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Information We Collect</strong></p>
                        <ul className="list-disc pl-6">
                            <li>Business information (name, email, phone)</li>
                            <li>
                                Customer data entered by businesses (phone number, visit
                                history, feedback)
                            </li>
                            <li>Usage data and analytics</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>How We Use Data</strong></p>
                        <ul className="list-disc pl-6">
                            <li>To provide and improve our services</li>
                            <li>To enable customer engagement and loyalty features</li>
                            <li>To generate analytics and insights</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Data Sharing</strong></p>
                        <p>
                            We do not sell personal data. However, data may be shared with:
                        </p>
                        <ul className="list-disc pl-6">
                            <li>
                                Service providers (e.g., messaging services like WhatsApp or SMS)
                            </li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Data Security</strong></p>
                        <p>
                            We implement industry-standard security measures to protect your
                            data from unauthorized access, misuse, or disclosure.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Data Retention</strong></p>
                        <p>
                            We retain data only as long as necessary to provide our
                            services and comply with legal obligations.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>User Rights</strong></p>
                        <p>
                            Users may request access, correction, or deletion of their
                            personal data by contacting us through official channels.
                        </p>
                    </div>

                </div>




            </div>
            <Footer />
        </>
    );
}