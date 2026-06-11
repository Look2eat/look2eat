export interface WhatsAppMessage {
    phoneNumber: string;
    templateName: string;
    variables: Record<string, string>;
    brandId: string;
}