const dishes = [
  {
    name: "Whole Grilled Croaker Fish",
    price: "₦8,500",
    badge: "Chef Signature",
    badgeClass: "bg-brand-red",
    rating: "4.9 (148)",
    time: "30-40 min",
    timeLabel: "Spicy",
    img: "https://lh3.googleusercontent.com/aida/ALJJyrBVHd3JRTt0SvVuUxBOLYdJlO66bp3hdDysv23kuDgjXnWIV3DYo-GSdMEcl4uX3W5DM_CxfwX4yyWHJxvBE0r2cKYaT0CAjK2C7axuYxCDJ8JojTNq2KS4v031qmN9m6r03tjVvHgQYR07wmJ5gpPQ0-TlhHVHOe7ClM-Ja6wymJgKXDT2b0jQub8avLVsVR3hR4i964zy0d3vmtCQAooKsnQyer83VHjZvoDI2Qo7PkbDlWGbEKLMfkA",
  },
  {
    name: "Smokey Party Jollof & Grilled Chicken",
    price: "₦5,500",
    badge: "Party Favorite",
    badgeClass: "bg-amber-600",
    rating: "4.8 (215)",
    time: "20-25 min",
    timeLabel: "Mild Pepper",
    img: "https://lh3.googleusercontent.com/aida/ALJJyrCZNtR6XyEHC0IhJtvoANjehKM8hZbJd-w-ojLnjnwXMRHWjPkgzbxBUk67MF9pavIQfDkhrJYKFn6UvUK4uF7BxmPvxBKT0ZUhCidknyU6AiVPr6tsjf24x3mK56A4C_LtPdB6ISMYBb3Klb8uo-vEjEmzE_XxPQUJxzQO1kg-LvsHtdI6NUXMrlcErVvQ4thX_nOfZYSCHt081XGFQz8MOxVEYsvf_sPs_i6MfgUk3Mo-EooRkCqF8y4dvmUreA",
  },
  {
    name: "Spicy Beef Suya Skewers (4 Sticks)",
    price: "₦4,200",
    badge: "Street Classic",
    badgeClass: "bg-orange-600",
    rating: "4.9 (98)",
    time: "15-20 min",
    timeLabel: "Extra Yaji",
    img: "https://lh3.googleusercontent.com/aida/ALJJyrAlutw5_FIVYCMv_8LnfbjcsZPxVFvspecjwrvpwA6ZKZ-j9BySm9khNh0RGElBqSpEZqvS1YEkkKwDQIAc9Vy4HE4_ACG-MarLp4ftx2zab0c_X_n3y5iTw-M7i3tU5Iwfe1jk34_Ng2GLkYsQJWHG2_3GIXByiQ5-_Lh_LLW9TguKqZK9ySK6uEtBf7ozHlJ858PTGy8jDLk4PAfpb1ViTMgv4OAB_ej3UEjY2Mon5pmod1-WBiayID08",
  },
  {
    name: "Rich Egusi Soup & Pounded Yam",
    price: "₦6,800",
    badge: "Native Pot",
    badgeClass: "bg-emerald-700",
    rating: "4.9",
    time: "25 min",
    timeLabel: "Traditional",
    img: "https://lh3.googleusercontent.com/aida/ALJJyrARmQ3b_IrMu-MljneCX6FBnPpmlQaN7mT5QcDDGNnSOgfv144UNdqpXuAuaiNbAc2wJiK2jlnBo73gAcUoej58M_Ve_eLE0nGnZRacUsybfNsf5FhPqUDsMB6winhPT46bED-FeiNd3vkeEKXL5mv9bRr8hKe4oZGCn89VLeMWRIMxV_hAFMhgKNlPDDm5q3KqEQ6Ye4Na5cmHG569OZy5Fn9FbgtzB2PRQkqcmwkwOJVAjoKXtm8qZjAz40df-gZT",
  },
];

function TopBar() {
  return (
    <div className="px-3 py-2.5 border-b border-light-outline-variant/50 bg-light-surface">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-light-primary-container flex items-center justify-center text-light-primary shrink-0">
            <span className="material-symbols-outlined text-base">location_on</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-0.5">
              <span className="font-label text-[8px] text-light-outline uppercase tracking-wider">
                Delivering to
              </span>
              <span className="material-symbols-outlined text-[11px] text-light-outline">
                keyboard_arrow_down
              </span>
            </div>
            <span className="font-headline text-[11px] text-light-on-surface truncate">
              Lekki Phase 1, Lagos
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-8 rounded-full bg-light-surface-container flex items-center justify-center text-light-on-surface relative">
            <span className="material-symbols-outlined text-base">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-yellow ring-2 ring-light-surface" />
          </span>
          <span className="w-8 h-8 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center relative shadow-sm">
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-yellow text-brand-dark text-[9px] font-label font-extrabold flex items-center justify-center">
              2
            </span>
          </span>
        </div>
      </div>

      {/* Live admin banner */}
      <div className="mt-2 bg-gradient-to-r from-red-600 via-brand-red to-amber-600 text-white rounded-lg p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <div className="flex flex-col">
            <span className="font-label text-[8px] uppercase tracking-wide text-amber-200 font-bold leading-tight">
              Admin Update: Today&apos;s Orders Active
            </span>
            <span className="text-[8px] font-medium text-white/95 leading-tight">
              Fresh Pots Sizzling • Order cutoff 6:30 PM
            </span>
          </div>
        </div>
        <span className="bg-white/20 text-white text-[8px] font-label px-2 py-0.5 rounded font-bold shrink-0">
          Live Today
        </span>
      </div>

      {/* Search bar (pinned) */}
      <div className="relative flex items-center mt-2">
        <span className="material-symbols-outlined absolute left-2.5 text-light-outline text-base pointer-events-none">
          search
        </span>
        <input
          type="search"
          placeholder="Search today's fish, jollof, soups..."
          className="w-full pl-8 pr-8 py-2 rounded-lg border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/70 text-[9px]"
        />
        <span className="absolute right-2 w-5 h-5 rounded-md bg-light-surface flex items-center justify-center text-light-outline border border-light-outline-variant">
          <span className="material-symbols-outlined text-[13px]">tune</span>
        </span>
      </div>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="px-4 py-1.5 border-t border-light-outline-variant/50 flex items-center justify-between bg-light-surface">
      <span className="flex flex-col items-center gap-0 text-light-primary">
        <span className="material-symbols-outlined text-base">restaurant_menu</span>
        <span className="font-label text-[7px] font-bold">Menu</span>
      </span>
      <span className="flex flex-col items-center gap-0 text-light-outline">
        <span className="material-symbols-outlined text-base">receipt_long</span>
        <span className="font-label text-[7px]">Orders</span>
      </span>
      <span className="flex flex-col items-center gap-0 text-light-outline relative">
        <span className="material-symbols-outlined text-base">shopping_cart</span>
        <span className="absolute top-0 right-1.5 w-3 h-3 rounded-full bg-brand-red text-white text-[7px] font-bold flex items-center justify-center">
          2
        </span>
        <span className="font-label text-[7px]">Cart</span>
      </span>
      <span className="flex flex-col items-center gap-0 text-light-outline">
        <span className="material-symbols-outlined text-base">support_agent</span>
        <span className="font-label text-[7px]">Help</span>
      </span>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="bg-light-surface text-light-on-surface font-body">
      {/* Scrollable main content — padded to clear fixed top bar & bottom nav */}
      <div className="px-3 pt-[88px] pb-[52px] space-y-3.5">
        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden bg-brand-dark text-white p-3">
          <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-brand-red/20 blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-yellow" />
                <span className="font-label text-[8px] text-brand-yellow font-bold uppercase tracking-wider">
                  Chef Lumi&apos;s Daily Drop
                </span>
              </div>
              <span className="text-[8px] text-stone-300 italic">&quot;fast &amp; yummy&quot;</span>
            </div>

            <h2 className="font-display text-[15px] font-extrabold text-white leading-tight">
              Today&apos;s Special: <span className="text-amber-400">Signature Grilled Croaker</span>
            </h2>
            <p className="text-[8px] text-stone-300 line-clamp-2">
              Fire-roasted fresh whole fish, smothered in scotch-bonnet chili sauce, served hot
              with plantain and herb potatoes.
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] text-stone-400 line-through">₦10,000</span>
                <span className="font-headline text-[14px] text-amber-400 font-bold">₦8,500</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-red text-white font-label text-[8px] font-bold">
                <span>Order Batch</span>
                <span className="material-symbols-outlined text-[11px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-headline text-[11px] text-light-on-surface">Categories Taking Orders</h3>
            <span className="text-[8px] text-light-primary font-bold">5 Available</span>
          </div>
          <div className="flex gap-1.5 overflow-hidden">
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-light-primary text-light-on-primary font-label text-[8px]">
              <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
              All Today (12)
            </span>
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-light-outline-variant text-light-on-surface font-label text-[8px]">
              <span className="material-symbols-outlined text-[13px] text-brand-red">set_meal</span>
              Fish
            </span>
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-light-outline-variant text-light-on-surface font-label text-[8px]">
              <span className="material-symbols-outlined text-[13px] text-amber-600">rice_bowl</span>
              Jollof
            </span>
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-light-outline-variant text-light-on-surface font-label text-[8px]">
              <span className="material-symbols-outlined text-[13px] text-orange-600">outdoor_grill</span>
              Suya
            </span>
          </div>
        </div>

        {/* Dish list header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline text-[11px] text-light-on-surface">Today&apos;s Hot Dishes</h3>
            <p className="text-[8px] text-light-outline">Prepared fresh per order by Chef Lumi</p>
          </div>
          <span className="text-[8px] font-label text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ● Ready to Cook
          </span>
        </div>

        {/* Dish cards */}
        <div className="space-y-2.5">
          {dishes.map((d) => (
            <div
              key={d.name}
              className="bg-light-surface rounded-xl overflow-hidden border border-light-outline-variant/60 shadow-xs flex flex-col"
            >
              <div className="relative w-full h-28 bg-light-surface-container overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-1.5 left-1.5 ${d.badgeClass} text-white text-[7px] font-label px-2 py-0.5 rounded-full uppercase tracking-wider font-bold`}
                >
                  {d.badge}
                </span>
                <span className="absolute bottom-1.5 right-1.5 bg-brand-dark/90 text-white text-[7px] font-label px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px] text-brand-yellow">star</span>
                  {d.rating}
                </span>
              </div>

              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-headline text-[11px] text-light-on-surface">{d.name}</h4>
                  <span className="font-headline text-[11px] text-light-primary font-bold shrink-0">
                    {d.price}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-light-outline-variant/40 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-0.5 text-[7px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[9px]">timer</span>
                      {d.time}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[7px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[9px]">local_fire_department</span>
                      {d.timeLabel}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-light-primary text-light-on-primary text-[8px] font-label font-bold">
                    <span className="material-symbols-outlined text-[10px]">add</span>
                    Select
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroMockup() {
  return (
    <div className="relative flex justify-center">
      {/* iPhone 18 (Deep Burgundy) frame */}
      <div className="relative w-[270px] sm:w-[300px]">
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-[110px] w-[3px] h-8 rounded-l-sm bg-[#4a1520]" />
        <span className="absolute -left-[3px] top-[150px] w-[3px] h-12 rounded-l-sm bg-[#4a1520]" />
        <span className="absolute -left-[3px] top-[210px] w-[3px] h-12 rounded-l-sm bg-[#4a1520]" />
        <span className="absolute -right-[3px] top-[160px] w-[3px] h-20 rounded-r-sm bg-[#4a1520]" />

        {/* Frame */}
        <div className="relative rounded-[48px] p-[10px] bg-gradient-to-b from-[#5a1f2c] via-[#4a1520] to-[#3a101a] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          {/* Inner bezel ring */}
          <div className="relative rounded-[40px] overflow-hidden bg-black p-[3px]">
            <div className="relative rounded-[37px] overflow-hidden bg-light-surface">
              {/* Status bar + Dynamic Island */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-3 pb-2 text-black bg-light-surface">
                <span className="text-[10px] font-label font-semibold">9:41</span>
                <span className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[76px] h-[22px] rounded-full bg-black" />
                <span className="flex items-center gap-[5px]">
                  {/* <span className="material-symbols-outlined text-[2px]">wifi</span> */}
                  {/* iOS horizontal battery: outlined capsule + filled portion + nub */}
                  <span className="flex items-center">
                    <span className="relative w-[18px] h-[8.5px] rounded-[2.5px] border border-black/50">
                      <span className="absolute inset-[1px] rounded-[1.5px] bg-black w-3/4" />
                    </span>
                    <span className="w-[1.5px] h-[3.5px] rounded-r-[1px] bg-black/50" />
                  </span>
                </span>
              </div>

              {/* App window with fixed chrome + scrollable middle */}
              <div className="relative h-[440px] overflow-hidden bg-light-surface">
                {/* Scrollable content (scrolls behind the fixed bar/nav) */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="mockup-scroll-track">
                    <HomeScreen />
                  </div>
                </div>

                {/* Fixed top app bar */}
                <div className="absolute top-0 left-0 right-0 z-20">
                  <TopBar />
                </div>

                {/* Fixed bottom nav */}
                <div className="absolute bottom-0 left-0 right-0 z-20">
                  <BottomNav />
                </div>

                {/* Home indicator (above bottom nav) */}
                {/* <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-black/30 z-20" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -inset-6 -z-10 rounded-full bg-brand-red/20 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
