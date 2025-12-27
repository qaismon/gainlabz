import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    const COMPANY_NAME = "Gain Lab";
    const WEBSITE_URL = "www.gainlabz.com";
    const SUPPORT_EMAIL = "support@test.com";

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Effective Date: December 1, 2025</p>

            <div className="bg-white p-6 sm:p-8 border border-gray-100 rounded-xl shadow-lg space-y-8">
                
                <p className="text-gray-700 leading-relaxed">
                    Your privacy is critically important to us. This policy outlines how {COMPANY_NAME} ("we," "our," or "us") collects, uses, and protects your information when you use our website, {WEBSITE_URL}.
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">1. Information We Collect</h2>
                    <p className="text-gray-700 mb-4">
                        We only collect information necessary to process your orders and improve your shopping experience.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">A. Information You Provide Directly</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                        <li>Account Data: Name, email, phone, and password when you register or place an order.</li>
                        <li>Payment Information: Payment details are collected but processed securely by third-party processors.</li>
                        <li>Shipping Data: Your address for order fulfillment.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">B. Automated Data Collection</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                        <li>Usage Data: Pages viewed and products searched.</li>
                        <li>Technical Data: IP address, browser type, and device type.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">2. How We Use Your Information</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Order Fulfillment: To process and deliver your gym supplements.</li>
                        <li>Communication: To send order confirmations, shipping updates, and respond to your inquiries.</li>
                        <li>Marketing (Optional): If you opt-in, to send promotions and special offers.</li>
                        <li>Security: To protect our website against fraud.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">3. Data Sharing and Disclosure</h2>
                    <p className="text-gray-700 mb-4">
                        We do not sell your personal data. We only share information with the following parties necessary for business operations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Payment Processors: To securely handle transactions.</li>
                        <li>Shipping Carriers:To deliver your purchases.</li>
                        <li>Legal Requirements: If required by law or official legal processes.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">4. Your Choices and Rights</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Access/Update: You can review and update your information by logging into your <Link to="/profile" className="text-blue-600 hover:underline font-medium">Profile</Link> page.</li>
                        <li>Opt-Out: You can unsubscribe from marketing emails via the link at the bottom of any email.</li>
                    </ul>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">5. Security and Contact</h2>
                    <p className="text-gray-700 mb-4">
                        We implement reasonable security measures (including SSL encryption) to protect your data. However, no internet transmission is 100% secure.
                    </p>
                    <p className="font-semibold text-gray-800 mt-6">
                        Contact Us: If you have any questions, please reach out to us at:
                        <br />
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-lg text-green-600 hover:underline font-bold transition-colors">
                            {SUPPORT_EMAIL}
                        </a>
                    </p>
                </section>

            </div>
        </div>
    );
};

export default PrivacyPolicy;