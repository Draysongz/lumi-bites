import Link from "next/link";

export default function About() {
  return (
    <section id="about-us" className="py-24 bg-light-surface border-b border-light-outline-variant/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: image mosaic */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-48 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida/ALJJyrCZNtR6XyEHC0IhJtvoANjehKM8hZbJd-w-ojLnjnwXMRHWjPkgzbxBUk67MF9pavIQfDkhrJYKFn6UvUK4uF7BxmPvxBKT0ZUhCidknyU6AiVPr6tsjf24x3mK56A4C_LtPdB6ISMYBb3Klb8uo-vEjEmzE_XxPQUJxzQO1kg-LvsHtdI6NUXMrlcErVvQ4thX_nOfZYSCHt081XGFQz8MOxVEYsvf_sPs_i6MfgUk3Mo-EooRkCqF8y4dvmUreA"
                  alt="Smokey Party Jollof"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-60 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida/ALJJyrAlutw5_FIVYCMv_8LnfbjcsZPxVFvspecjwrvpwA6ZKZ-j9BySm9khNh0RGElBqSpEZqvS1YEkkKwDQIAc9Vy4HE4_ACG-MarLp4ftx2zab0c_X_n3y5iTw-M7i3tU5Iwfe1jk34_Ng2GLkYsQJWHG2_3GIXByiQ5-_Lh_LLW9TguKqZK9ySK6uEtBf7ozHlJ858PTGy8jDLk4PAfpb1ViTMgv4OAB_ej3UEjY2Mon5pmod1-WBiayID08"
                  alt="Spicy Beef Suya"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="rounded-2xl overflow-hidden h-60 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida/ALJJyrBVHd3JRTt0SvVuUxBOLYdJlO66bp3hdDysv23kuDgjXnWIV3DYo-GSdMEcl4uX3W5DM_CxfwX4yyWHJxvBE0r2cKYaT0CAjK2C7axuYxCDJ8JojTNq2KS4v031qmN9m6r03tjVvHgQYR07wmJ5gpPQ0-TlhHVHOe7ClM-Ja6wymJgKXDT2b0jQub8avLVsVR3hR4i964zy0d3vmtCQAooKsnQyer83VHjZvoDI2Qo7PkbDlWGbEKLMfkA"
                  alt="Signature Grilled Croaker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-48 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida/ALJJyrARmQ3b_IrMu-MljneCX6FBnPpmlQaN7mT5QcDDGNnSOgfv144UNdqpXuAuaiNbAc2wJiK2jlnBo73gAcUoej58M_Ve_eLE0nGnZRacUsybfNsf5FhPqUDsMB6winhPT46bED-FeiNd3vkeEKXL5mv9bRr8hKe4oZGCn89VLeMWRIMxV_hAFMhgKNlPDDm5q3KqEQ6Ye4Na5cmHG569OZy5Fn9FbgtzB2PRQkqcmwkwOJVAjoKXtm8qZjAz40df-gZT"
                  alt="Rich Egusi Soup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: what Lumi's Bites is about */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-label-md font-label font-bold text-brand-red uppercase tracking-wider">
              About Lumi&apos;s Bites
            </span>

            <h2 className="font-display text-headline-lg-mobile lg:text-display-md font-extrabold text-light-on-surface leading-tight">
              Born From A Passion For Real Food, Soulful Spice, And Effortless Ordering.
            </h2>

            <p className="text-body-lg text-light-outline leading-relaxed">
              In a fast-paced city like Lagos, good food often gets compromised for speed,
              or great food takes hours of chaotic phone calls and manual bank transfer
              screenshots. <strong>Lumi&apos;s Bites was created to bridge this gap completely.</strong>
            </p>

            <p className="text-body-md text-light-outline leading-relaxed">
              We operate as a focused online cloud kitchen. Instead of maintaining an
              overwhelming 50-dish menu of pre-made food, our kitchen admin selects and
              announces what fresh pots are being cooked each day. Whether it&apos;s
              charcoal-grilled whole fish, firewood party jollof, or pounded yam with rich
              egusi soup, each portion is prepared with unhurried care and handed directly
              to dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-light-surface-container border border-light-outline-variant/50">
                <div className="flex items-center gap-2.5 mb-1.5 text-brand-red">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                  <h4 className="font-headline text-headline-sm text-light-on-surface">
                    Daily Fresh Pots
                  </h4>
                </div>
                <p className="text-body-sm text-light-outline">
                  The admin opens the kitchen daily with fresh market produce.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-light-surface-container border border-light-outline-variant/50">
                <div className="flex items-center gap-2.5 mb-1.5 text-amber-600">
                  <span className="material-symbols-outlined text-2xl">payment</span>
                  <h4 className="font-headline text-headline-sm text-light-on-surface">
                    Seamless Online Pay
                  </h4>
                </div>
                <p className="text-body-sm text-light-outline">
                  Instant confirmation through cards and transfers. No waiting.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-red text-white font-label text-label-lg font-bold hover:brightness-110 active:scale-98 transition-state-change shadow-md w-full sm:w-auto"
              >
                <span>Launch App &amp; Taste The Difference</span>
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
