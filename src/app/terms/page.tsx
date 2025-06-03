import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'

export default function Terms() {
  return (
    <Layout>
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
          <div className="mx-auto max-w-3xl p-6">
            {/* ------------------------------------------------ */}
            {/*   HEADER                                       */}
            {/* ------------------------------------------------ */}
            <h1 className="mb-4 text-3xl font-bold">
              Terms and Conditions for Cove
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              <strong>Effective&nbsp;Date:</strong> June&nbsp;3,&nbsp;2025
              &nbsp;|&nbsp;
              <strong>Last&nbsp;Updated:</strong> June&nbsp;3,&nbsp;2025
            </p>

            {/* ------------------------------------------------ */}
            {/*   INTRODUCTION                                  */}
            {/* ------------------------------------------------ */}
            <section className="mb-8 space-y-4 text-base">
              <p>
                These Terms and Conditions (together with our&nbsp;
                <a
                  href="/privacy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Privacy&nbsp;Policy
                </a>
                &nbsp;and any other documents we reference) govern your use of
                the Cove mobile application and related websites, APIs, and
                services (collectively, the <strong>“Services”</strong>)
                provided by InfraOps&nbsp;LLC, doing business as Cove (
                <strong>“Cove,” “we,” “our,”</strong> or <strong>“us”</strong>).
              </p>
              <p>
                We may revise these Terms from time to time. When we do, we will
                update the <em>Last&nbsp;Updated</em> date above. Your continued
                use of the Services after any revision constitutes acceptance of
                the updated Terms.
              </p>
            </section>

            {/* ------------------------------------------------ */}
            {/*   ACCEPTANCE & AGE RESTRICTION                  */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Acceptance &amp; Age Restriction
            </h2>
            <p className="text-base">
              By downloading, installing, or using the Cove Bitcoin Wallet (
              <strong>“Cove”</strong>), you certify that you are at least 18
              years old and legally capable of entering into a binding
              agreement, and you agree to be bound by these Terms. If you do not
              agree—or do not meet the age requirement—do not use Cove.
            </p>

            {/* ------------------------------------------------ */}
            {/*   APPLE EULA NOTICE                             */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Apple&nbsp;App&nbsp;Store Notice
            </h2>
            <p className="text-base">
              If you obtained Cove through the Apple App Store, the Apple
              <em> Licensed Application End User License Agreement</em> (the
              <strong>“Apple Standard EULA”</strong>) also applies. In the event
              of any conflict between these Terms and the Apple Standard EULA,
              these Terms will control to the extent permitted by applicable
              law.
            </p>

            {/* ------------------------------------------------ */}
            {/*   USE OF COVE                                   */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">Use of Cove</h2>
            <ul className="list-inside list-disc space-y-2 text-base">
              <li>
                Cove is a <strong>non-custodial</strong> Bitcoin wallet allowing
                you to securely store, send, and receive Bitcoin. We never take
                possession of—nor can we recover—your private keys or seed
                phrases.
              </li>
              <li>
                Cove <strong>does not</strong> facilitate mining, staking,
                on-ramp/off-ramp exchange services, token rewards, or the
                issuance of new digital assets.
              </li>
              <li>
                All transactions are recorded on the Bitcoin blockchain and are
                <strong> irreversible </strong> once broadcast.
              </li>
            </ul>

            {/* ------------------------------------------------ */}
            {/*   SUPPORTED ASSETS                              */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Supported Digital Assets
            </h2>
            <ul className="list-inside list-disc space-y-2 text-base">
              <li>Cove supports only Bitcoin (BTC).</li>
              <li>
                Attempting to use unsupported assets (including forks, altcoins,
                or airdrops) may lead to permanent loss of those assets. Cove
                assumes no responsibility for such attempts.
              </li>
            </ul>

            {/* ------------------------------------------------ */}
            {/*   WALLET SECURITY                               */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Responsibility for Wallet Security
            </h2>
            <ul className="list-inside list-disc space-y-2 text-base">
              <li>
                Cove provides tools (mnemonics, PINs, biometric lock, etc.) for
                local wallet security, but you alone are responsible for
                safeguarding them.
              </li>
              <li>
                Loss, theft, or destruction of your seed phrase or private keys
                will result in <strong>permanent loss</strong> of access to your
                funds.
              </li>
            </ul>

            {/* ------------------------------------------------ */}
            {/*   RISK DISCLOSURE                               */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Risk Disclosure
            </h2>
            <p className="text-base">
              Cryptocurrencies are inherently volatile and subject to numerous
              technical, regulatory, and security risks. By using Cove you
              acknowledge that you understand these risks and agree that you
              bear sole responsibility for securing suitable backups of your
              seed phrase.
            </p>

            {/* ------------------------------------------------ */}
            {/*   LIMITATION OF LIABILITY                       */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Limitation of Liability &amp; Warranty Disclaimer
            </h2>
            <p className="text-base">
              The Services are provided{' '}
              <strong>“AS IS” and “AS AVAILABLE,”</strong>
              without warranties of any kind, whether express or implied. To the
              fullest extent permitted by law, Cove disclaims all implied
              warranties, including merchantability, fitness for a particular
              purpose, and non-infringement. Nothing in this section affects
              statutory rights that cannot be waived.
            </p>
            <p className="mt-4 text-base">
              To the maximum extent permitted by law, Cove and its developers
              will not be liable for any direct, indirect, incidental,
              consequential, special, or exemplary damages arising from or
              related to your use—or inability to use—the Services, including
              but not limited to:
            </p>
            <ul className="list-inside list-disc space-y-2 text-base">
              <li>Loss of funds due to forgotten mnemonics or PINs.</li>
              <li>Incorrect transaction details supplied by you.</li>
              <li>Compromised device security or malware.</li>
              <li>Blockchain network failures or forks.</li>
              <li>Bugs, coding errors, or software defects.</li>
            </ul>
            <p className="mt-4 text-base">
              <strong>Aggregate Cap:</strong> Notwithstanding anything to the
              contrary, Cove’s aggregate liability to you for any claim will not
              exceed the greater of (i) USD&nbsp;$100 or (ii) the total fees you
              paid to Cove (if any) in the twelve (12) months preceding the
              event giving rise to the claim.
            </p>

            {/* ------------------------------------------------ */}
            {/*   ARBITRATION CLAUSE                            */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Arbitration Agreement
            </h2>
            <p className="text-base">
              <strong>Binding&nbsp;Arbitration.</strong> Any dispute, claim, or
              controversy arising out of or relating to these Terms or the
              Services (<strong>“Dispute”</strong>) will be resolved exclusively
              by binding arbitration administered by the American Arbitration
              Association (<strong>“AAA”</strong>) under its Consumer
              Arbitration Rules.
            </p>
            <p className="mt-2 text-base">
              <strong>Opt-Out.</strong> You may opt out of this arbitration
              agreement by sending written notice to
              &nbsp;support@covebitcoinwallet.com&nbsp;within thirty&nbsp;(30)
              days of first accepting these Terms. If you opt out, neither party
              will be bound to arbitrate Disputes.
            </p>
            <p className="mt-2 text-base">
              <strong>Small Claims Exception.</strong> Either party may pursue
              an individual claim in small-claims court in Travis&nbsp;County,
              Texas, or any other court of competent jurisdiction so long as the
              claim remains in that venue and only seeks non-injunctive relief.
            </p>
            <p className="mt-2 text-base">
              <strong>Class Action &amp; Jury Waiver.</strong> Arbitration will
              proceed on an individual basis. YOU AND COVE WAIVE ANY RIGHT TO A
              JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION.
            </p>
            <p className="mt-2 text-base">
              <strong>Fees.</strong> Each party will bear its own attorneys’
              fees. Cove will pay arbitration fees beyond the first USD $200,
              unless prohibited by applicable law.
            </p>
            <p className="mt-2 text-base">
              <strong>Survival.</strong> This arbitration agreement survives
              termination of the Services.
            </p>

            {/* ------------------------------------------------ */}
            {/*   THIRD-PARTY INTEGRATIONS                      */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Third-Party Integrations
            </h2>
            <p className="text-base">
              Cove may rely on third-party blockchain nodes, data providers, or
              other services. Cove is not responsible for the availability or
              accuracy of third-party services and will not be liable for any
              loss arising from their failure or malfunction.
            </p>

            {/* ------------------------------------------------ */}
            {/*   SANCTIONS & EXPORT COMPLIANCE                 */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Sanctions &amp; Export Compliance
            </h2>
            <p className="text-base">
              You represent that you are not located in, under the control of,
              or a national or resident of any country subject to U.S. embargoes
              or sanctions, nor are you on any sanctions list administered by
              the U.S. Treasury’s Office of Foreign Assets Control (OFAC) or
              other applicable authority. Cove may restrict or terminate the
              Services immediately if you breach this representation.
            </p>

            {/* ------------------------------------------------ */}
            {/*   TAX RESPONSIBILITY                            */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">Taxes</h2>
            <p className="text-base">
              You are solely responsible for determining, reporting, and paying
              any taxes that apply to your Bitcoin transactions. Cove does not
              provide tax documentation or advice.
            </p>

            {/* ------------------------------------------------ */}
            {/*   SERVICE CHANGES & SUPPORT                     */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Changes to Services &amp; Support
            </h2>
            <p className="text-base">
              We may add, modify, or discontinue features at any time without
              liability. Cove provides the official release of the software on
              an <em>as-is</em> basis and has no obligation to support
              unofficial forks, modified builds, or versions distributed by
              third parties.
            </p>

            {/* ------------------------------------------------ */}
            {/*   COMPLIANCE WITH LAWS                          */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Compliance with Laws
            </h2>
            <p className="text-base">
              You agree to use Cove only in compliance with all applicable laws,
              regulations, and self-regulatory guidelines, including but not
              limited to anti-money-laundering (AML) and counter-terrorist
              financing (CTF) requirements.
            </p>

            {/* ------------------------------------------------ */}
            {/*   GOVERNING LAW                                 */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">Governing Law</h2>
            <p className="text-base">
              These Terms are governed by the laws of the State of Texas,
              without regard to its conflict-of-laws principles.
            </p>

            {/* ------------------------------------------------ */}
            {/*   NO FINANCIAL OR LEGAL ADVICE                 */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              No Financial, Legal, or Tax Advice
            </h2>
            <p className="text-base">
              The information provided through the Services does not constitute
              legal, financial, investment, or tax advice. You should consult
              qualified advisors before making any decision.
            </p>

            {/* ------------------------------------------------ */}
            {/*   SEVERABILITY & ENTIRE AGREEMENT              */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">Severability</h2>
            <p className="text-base">
              If any provision of these Terms is held unenforceable, that
              provision will be limited to the minimum extent necessary, and the
              remaining provisions will continue in full force and effect.
            </p>

            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Entire Agreement
            </h2>
            <p className="text-base">
              These Terms, together with the&nbsp;
              <a
                href="/privacy"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Privacy Policy
              </a>
              , constitute the entire agreement between you and Cove and
              supersede all prior understandings regarding the Services.
            </p>

            {/* ------------------------------------------------ */}
            {/*   CONTACT                                       */}
            {/* ------------------------------------------------ */}
            <h2 className="mt-8 mb-2 text-2xl font-semibold">Contact</h2>
            <p className="text-base">
              Questions? Email us at&nbsp;
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
              BY USING COVE YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND, AND
              AGREE TO THESE TERMS AND CONDITIONS.
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
