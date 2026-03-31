import { Footer } from "@/components/blocks/footer-section";


export default function DataProtectionPage() {
    return (
        <>
            <div className="max-w-3xl mx-auto px-6 py-12">

                <h1 className="text-4xl font-bold mb-6">
                    Data Protection
                </h1>

                <p className="mb-6 text-muted-foreground">
                    Zuplin follows strict data protection practices to ensure the safety,
                    integrity, and confidentiality of all data handled on our platform.
                </p>

                <div className="space-y-6 [&_strong]:font-semibold [&_strong]:text-foreground">

                    <div className="space-y-2">
                        <p><strong>Data Ownership</strong></p>
                        <ul className="list-disc pl-6">
                            <li>Businesses retain full ownership of their customer data</li>
                            <li>Zuplin acts as a data processor on behalf of businesses</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Access Control</strong></p>
                        <ul className="list-disc pl-6">
                            <li>Role-based access (Owner, Manager, Cashier)</li>
                            <li>Restricted access to sensitive data</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Encryption & Security</strong></p>
                        <ul className="list-disc pl-6">
                            <li>Data is stored securely using industry best practices</li>
                            <li>Sensitive operations are protected against unauthorized access</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Third-Party Integrations</strong></p>
                        <ul className="list-disc pl-6">
                            <li>
                                Only necessary integrations (e.g., WhatsApp, SMS, Google Reviews)
                                are used
                            </li>
                            <li>No unnecessary data sharing with external services</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Compliance</strong></p>
                        <p>
                            We aim to comply with applicable data protection regulations and
                            continuously improve our security and compliance practices.
                        </p>
                    </div>

                </div>



            </div>
            <Footer />
        </>
    );
}