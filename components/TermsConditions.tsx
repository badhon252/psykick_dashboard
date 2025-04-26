import React from "react";

const TermsConditions = () => {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Terms & conditions</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
          Edit
        </button>
      </div>

      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="text-white space-y-4 max-h-96 overflow-y-auto">
          <p className="text-gray-300">Effective Date: [Insert Date]</p>
          <p>
            Welcome to [Your Game Website Name]. Please read these Terms and
            Conditions carefully before using the Site or any of its services.
            By accessing or using the Site, you agree to be bound by these
            Terms. If you do not agree with these Terms, please do not use the
            Site.
          </p>

          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By using the Site, you agree to comply with and be bound by these
            Terms and any additional terms or policies that may apply to
            specific sections or features of the Site.
          </p>

          <h2 className="text-xl font-semibold">2. Use of the Site</h2>
          <p>
            You agree to use the Site in a manner that is lawful and in
            compliance with these Terms. You must not:
          </p>
          <ul className="list-disc pl-8">
            <li>
              Violate any local, state, or international laws or regulations.
            </li>
            <li>
              Engage in fraudulent activities or misuse the Site for any
              unlawful purposes.
            </li>
            <li>
              Upload or distribute harmful content, such as viruses, malware, or
              any other malicious software.
            </li>
            <li>
              Attempt to hack, decompile, reverse-engineer, or otherwise
              interfere with the functionality or security.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p>
            Some features of the Site may require the creation of an account.
            You agree to:
          </p>
          <ul className="list-disc pl-8">
            <li>
              Provide accurate, current, and complete information when
              registering.
            </li>
            <li>
              Maintain the confidentiality of your account and password, and
              notify us immediately of any unauthorized use of your account.
            </li>
            <li>
              You are responsible for all activities that occur under your
              account.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
          <p>
            All content provided on the Site, including but not limited to game
            images, logos, text, videos, and software, is owned by [Your Game
            Website Name] or its licensors. You are granted a non-exclusive,
            non-transferable license to use the content for personal,
            non-commercial purposes. You may not copy, modify, or distribute the
            content without our express permission.
          </p>

          <h2 className="text-xl font-semibold">5. In-Game Purchases</h2>
          <p>
            Some games on the Site may offer in-game purchases or premium
            content. If you make a purchase, you agree to comply with the
            payment terms and conditions outlined at the point of sale. All
            purchases are final, and we do not provide refunds unless required
            by law.
          </p>

          <h2 className="text-xl font-semibold">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-8">
            <li>
              Use cheats, bots, or other unauthorized third-party software that
              interfere with the game experience.
            </li>
            <li>
              Harass, threaten, or engage in disruptive behavior with other
              players.
            </li>
            <li>
              Exploit any bugs or glitches in the games to gain an unfair
              advantage.
            </li>
            <li>
              Post offensive, inappropriate, or abusive content on the Site or
              within game environments.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">7. Privacy Policy</h2>
          <p>
            Your use of the Site is also governed by our Privacy Policy, which
            can be found [here]. By using the Site, you consent to our
            collection, use, and disclosure of your personal data in accordance
            with the Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold">8. Disclaimers</h2>
          <p>
            The Site and all games, services, and content are providedwithout
            warranties of any kind, either express or implied. We do not
            guarantee that the Site or any game will be error-free,
            uninterrupted, or secure.
          </p>

          <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, [Your Game Website Name],
            its affiliates, partners, and employees are not liable for any
            damages arising from your use or inability to use the Site,
            including but not limited to any direct, indirect, incidental, or
            consequential damages.
          </p>

          <h2 className="text-xl font-semibold">
            10. Modifications to the Terms
          </h2>
          <p>
            We reserve the right to modify or update these Terms at any time.
            Any changes will be posted on this page with an updated Your
            continued use of the Site after any changes constitutes your
            acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-semibold">11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of [Your Country/State], and
            any disputes arising from these Terms will be resolved in the
            appropriate courts in [Location].
          </p>
        </div>

        <div className="mt-6">
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
