export interface ContentSection {
  heading?: string;
  body: string[];
}

export interface ContentPage {
  title: string;
  intro?: string;
  sections: ContentSection[];
}

export const CONTENT_PAGES: Record<string, ContentPage> = {
  contact: {
    title: "Contact Us",
    intro:
      "We're here to help with orders, sizing, and returns. Reach us any of the ways below and we'll get back within 24 hours.",
    sections: [
      {
        heading: "Customer Care",
        body: [
          "Email: eclatiqueclothing@gmail.com (general inquiries, orders, and returns).",
          "Phone / WhatsApp: +91 91365 98936",
          "Hours: Mon to Sat, 10am to 7pm IST",
        ],
      },
      {
        heading: "Studio",
        body: ["Mumbai, Maharashtra, India"],
      },
      {
        heading: "Follow",
        body: ["Instagram: @eclatiqueclothing"],
      },
    ],
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    sections: [
      {
        heading: "Shipping",
        body: [
          "We offer free delivery across India. Orders are dispatched within 1 to 2 business days and typically arrive within 3 to 7 business days depending on your location.",
          "We currently ship within India only.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "We accept returns within 3 days of delivery for unused items with original tags intact.",
          "To initiate a return, email us at eclatiqueclothing@gmail.com with your order number.",
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "Orders can be cancelled within 2 hours of being placed. Contact us as soon as possible if you need to make a change.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      {
        body: [
          "By using this website and placing an order, you agree to our terms of sale. All prices are listed in INR and are inclusive of applicable taxes.",
          "We reserve the right to refuse or cancel any order at our discretion. Product colours may vary slightly from screen to garment.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        body: [
          "We collect only the information needed to process and deliver your order: your name, contact details, and shipping address. We never sell your data.",
          "Payment information is handled securely by our payment partner and is never stored on our servers.",
        ],
      },
    ],
  },
};
