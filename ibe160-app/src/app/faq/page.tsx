"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How does the barcode scanning feature work?",
      answer: "Simply tap the scan button in your pantry, point your camera at the product barcode, and our app will automatically recognize the item using the Open Food Facts database. It will add the product with its name, image, and suggested expiration date to your pantry inventory."
    },
    {
      question: "How accurate are the expiration date predictions?",
      answer: "Our AI uses industry-standard food safety guidelines combined with product information from databases. For products with printed expiration dates, you can manually adjust them. We provide alerts for items expiring soon (within 3 days), expiring today, and already expired items."
    },
    {
      question: "Can I use the app offline?",
      answer: "Yes! Once your pantry is synced, you can view your inventory offline. However, features like AI recipe search, barcode scanning, and syncing across devices require an internet connection."
    },
    {
      question: "How does the AI recipe search work?",
      answer: "Our AI (powered by Google Gemini 2.0) analyzes the ingredients you have in your pantry and suggests recipes you can make. You can also use natural language to search, like 'quick dinner for 2' or 'vegetarian pasta'. The AI understands your preferences and dietary restrictions."
    },
    {
      question: "Will I receive notifications for expiring items?",
      answer: "Yes! You'll receive notifications when items are about to expire. We send alerts 3 days before expiration, on the day of expiration, and mark items that have already expired. You can customize notification settings in your profile."
    },
    {
      question: "Can I share my pantry with family members?",
      answer: "Currently, each account has its own pantry. Family sharing features are planned for a future update. For now, you can use a shared account to manage a household pantry together."
    },
    {
      question: "How do I edit or delete items from my pantry?",
      answer: "Tap on any item in your pantry to open its details. From there, you can edit the quantity, expiration date, category, or delete the item entirely. Swipe left on an item for quick delete access."
    },
    {
      question: "What should I do if the barcode doesn't scan?",
      answer: "If a barcode doesn't scan, you can manually add the item by tapping the '+' button. Enter the item name, category, quantity, and expiration date. Make sure there's good lighting when scanning, and hold your phone steady for best results."
    },
    {
      question: "How does the grocery list feature work?",
      answer: "The smart grocery list tracks items you've used up from your pantry. You can also manually add items you need. The app learns your shopping patterns and can suggest items you regularly purchase."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes! We take data security seriously. Your data is encrypted in transit and at rest. We use Supabase PostgreSQL for secure database storage and NextAuth.js for authentication. We never sell your data to third parties."
    },
    {
      question: "Can I export my pantry data?",
      answer: "Data export features are currently in development. You'll soon be able to export your pantry inventory and shopping lists as CSV files for backup or analysis purposes."
    },
    {
      question: "What categories can I organize my food into?",
      answer: "You can organize items into categories like Dairy, Produce, Meat, Grains, Canned Goods, Frozen, Snacks, Beverages, and Condiments. You can also create custom categories to fit your specific needs."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about our food waste management app.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-2 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-700 mb-4">
              Can't find the answer you're looking for? Feel free to contact our support team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
