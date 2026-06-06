// Native affiliate recommendation card. Replace `href` with your affiliate link.
export default function RecoCard({
  icon, headline, body, cta, href,
}: { icon: string; headline: string; body: string; cta: string; href: string }) {
  return (
    <div className="bg-paper2 border-2 border-dashed border-ink rounded-xl2 px-[18px] py-4 mt-5 flex gap-3.5 items-center flex-wrap">
      <div className="text-2xl leading-none">{icon}</div>
      <div className="flex-1 min-w-[180px]">
        <b className="text-[14.5px]">{headline}</b>
        <p className="text-[13px] text-ink2 mt-0.5">{body}</p>
      </div>
      <a href={href} target="_blank" rel="sponsored nofollow"
        className="bg-ink text-paper no-underline font-semibold text-[13.5px] py-2.5 px-4 rounded-full whitespace-nowrap hover:-translate-y-0.5 transition-transform">
        {cta}
      </a>
    </div>
  );
}
