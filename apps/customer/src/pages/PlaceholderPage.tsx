/* Reserved routes should never expose developer-only links or mockup notes
   to customers. Keep this page intentionally minimal until content is ready. */
export function PlaceholderPage({title}:{title:string;reference:string}){
  return <section className="bmp-account-page mx-auto mt-5 max-w-[680px] md:mt-10"
    aria-label={title}>
    <div className="rounded-[25px] border border-[#EDE9E3] bg-[#FFFCF9] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
      <h1 className="bmp-display text-[clamp(30px,8vw,43px)] text-[#092F23]">{title}</h1>
      <p className="mx-auto mt-3 max-w-[360px] text-[15px] leading-[1.55] text-[#626B63]">
        Информация в этом разделе скоро появится.
      </p>
    </div>
  </section>;
}
