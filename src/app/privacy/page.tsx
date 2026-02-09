import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'

export default function Privacy() {
  return (
    <Layout>
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
          {/* ------------------------------------------------ */}
          {/*   HEADER                                        */}
          {/* ------------------------------------------------ */}
          <h1 className="mb-4 text-3xl font-bold">Privacy Policy for Cove</h1>
          <p className="mb-6 text-sm text-gray-600">
            <strong> Effective Date: </strong> June&nbsp;3,&nbsp;2025
            &nbsp;|&nbsp;
            <strong> Last Updated: </strong> June&nbsp;3,&nbsp;2025
          </p>

          {/* ------------------------------------------------ */}
          {/*   INTRODUCTION                                   */}
          {/* ------------------------------------------------ */}
          <section className="mb-8 space-y-4 text-base">
            <p>
              This Privacy Policy explains how InfraOps&nbsp;LLC, doing business
              as Cove (<strong>“Cove,” “we,” “our,”</strong> or{' '}
              <strong>“us”</strong>) handles information when you use the Cove
              mobile application and related websites, APIs, and services
              (collectively, the
              <strong>“Services”</strong>).
            </p>
            <p>
              We may update this Policy periodically. When we do, we will revise
              the
              <em> Last Updated </em> date above, and—in the case of material
              changes—provide in-app or other prominent notice. Continued use of
              the Services after any update constitutes acceptance of the
              revised Policy.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/*   ZERO-COLLECTION STATEMENT                      */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            1. Information We <em>Do&nbsp;Not</em> Collect
          </h2>
          <ul className="list-inside list-disc space-y-2 text-base">
            <li>
              We do <strong>not</strong> require account creation, email
              sign-up, or KYC.
            </li>
            <li>
              We do <strong>not</strong> collect, store, or transmit personal
              identifiers (name, address, SSN, etc.).
            </li>
            <li>
              We do <strong>not</strong> harvest device IDs, advertising
              identifiers, or precise location data.
            </li>
            <li>
              We do <strong>not</strong> embed third-party analytics SDKs, ad
              networks, or fingerprinting scripts.
            </li>
          </ul>

          {/* ------------------------------------------------ */}
          {/*   INFORMATION STORED LOCALLY                     */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            2. Information Stored Locally on Your Device
          </h2>
          <ul className="list-inside list-disc space-y-2 text-base">
            <li>
              <strong>Wallet Data.</strong> Your Bitcoin private keys and seed
              phrases are generated and encrypted locally (ChaCha20-Poly1305)
              and stored in the iOS Keychain/secure enclave. They never leave
              your device.
            </li>
            <li>
              <strong>Transaction History.</strong> We cache recent transaction
              metadata locally to speed up wallet loading. This cache never
              leaves your device unless you manually export it.
            </li>
          </ul>

          {/* ------------------------------------------------ */}
          {/*   PERMISSIONS                                    */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            3. Device Permissions We Request
          </h2>
          <ul className="list-inside list-disc space-y-2 text-base">
            <li>
              <strong>Camera.</strong> Used only for scanning QR codes that you
              choose to scan. Images are processed on-device and are not stored.
            </li>
            <li>
              <strong>NFC.</strong> Used exclusively for reading NFC tags you
              present to the device to retrieve Bitcoin addresses or sign
              transactions. Data read via NFC stays on-device.
            </li>
            <li>
              <strong>Biometrics / Face&nbsp;ID / Touch&nbsp;ID.</strong>{' '}
              Optional; used for higher-security unlocking of your local wallet.
              Biometric data never leaves the secure enclave and is inaccessible
              to Cove.
            </li>
          </ul>

          {/* ------------------------------------------------ */}
          {/*   CRASH & DIAGNOSTICS                             */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            4. Crash Reports & Diagnostics
          </h2>
          <p className="text-base">
            We rely solely on Apple&apos;s built-in, opt-in crash reporting
            (&ldquo;App Analytics&rdquo;). If you have disabled sharing with
            developers in iOS
            settings, we receive no diagnostics. Reports provided by Apple are
            anonymized and contain no personal identifiers.
          </p>

          {/* ------------------------------------------------ */}
          {/*   BLOCKCHAIN DATA                                 */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            5. Public Blockchain Data
          </h2>
          <p className="text-base">
            When you broadcast a transaction, the Bitcoin network will record
            your public address, transaction inputs/outputs, and on-chain
            metadata. This information is inherently public and beyond Cove’s
            control.
          </p>

          {/* ------------------------------------------------ */}
          {/*   INFORMATION SHARING                             */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            6. Information Sharing &amp; Disclosure
          </h2>
          <ul className="list-inside list-disc space-y-2 text-base">
            <li>We do not sell or rent any data.</li>
            <li>
              We have no data to share with advertisers or analytics vendors.
            </li>
            <li>
              We may disclose minimal, aggregated diagnostic data as required to
              comply with legal obligations (e.g., court order). However, we
              cannot produce what we never collect.
            </li>
          </ul>

          {/* ------------------------------------------------ */}
          {/*   DATA RETENTION                                  */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            7. Data Retention
          </h2>
          <p className="text-base">
            Because Cove does not collect personal data, there is no retention
            of such data. Any optional crash logs received via Apple are kept in
            Apple’s developer console for up to 25 months and then deleted per
            Apple policy.
          </p>

          {/* ------------------------------------------------ */}
          {/*   USER RIGHTS                                     */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            8. Your Rights &amp; Choices
          </h2>
          <p className="text-base">
            Although we hold no personal data, you may have rights under GDPR,
            CCPA, or similar laws (e.g., to access, delete, or correct data). If
            you believe we somehow possess your personal information, contact us
            and we will promptly investigate and honor applicable rights.
          </p>

          {/* ------------------------------------------------ */}
          {/*   CHILDREN'S PRIVACY                             */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            9. Children’s Privacy
          </h2>
          <p className="text-base">
            The Services are not directed to children under 13, and we do not
            knowingly collect personal information from anyone under 13. If we
            become aware that a child has provided us personal information, we
            will delete it immediately.
          </p>

          {/* ------------------------------------------------ */}
          {/*   INTERNATIONAL TRANSFERS                        */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            10. International Data Transfers
          </h2>
          <p className="text-base">
            We do not transfer personal data across borders. Diagnostic crash
            reports (if you opt in) are processed by Apple servers, which may be
            located outside your country. Apple applies its own safeguards for
            such transfers.
          </p>

          {/* ------------------------------------------------ */}
          {/*   SECURITY                                        */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            11. Security Measures
          </h2>
          <ul className="list-inside list-disc space-y-2 text-base">
            <li>Local encryption (ChaCha20-Poly1305) for wallet data.</li>
            <li>Secure enclave + Keychain for key storage.</li>
            <li>Optional biometric access.</li>
            <li>
              Open-source codebase allows public auditing of security model.
            </li>
          </ul>

          {/* ------------------------------------------------ */}
          {/*   CHANGES TO POLICY                               */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">
            12. Changes to This Privacy Policy
          </h2>
          <p className="text-base">
            We may update this Policy. If we ever introduce analytics or data
            collection, we will update App Store privacy labels and seek your
            explicit consent where required.
          </p>

          {/* ------------------------------------------------ */}
          {/*   CONTACT                                         */}
          {/* ------------------------------------------------ */}
          <h2 className="mt-8 mb-2 text-2xl font-semibold">13. Contact Us</h2>
          <p className="text-base">
            Questions? Email&nbsp;
            <a
              href="mailto:support@covebitcoinwallet.com"
              className="text-blue-600 underline hover:text-blue-800"
            >
              support@covebitcoinwallet.com
            </a>
            .
          </p>

          <hr className="my-8" />
          <p className="text-center font-semibold">
            BY USING COVE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD
            THIS PRIVACY POLICY.
          </p>
        </div>
      </Container>
    </Layout>
  )
}
