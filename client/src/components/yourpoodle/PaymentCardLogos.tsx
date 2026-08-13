type Props = {
  /** Desktop height in px; mobile stays compact (~22px) */
  height?: number;
  className?: string;
  /** Link for the whole band (e.g. /odeme-kartlari or /iyzico) */
  href?: string;
  /** @deprecated band includes iyzico; kept for call-site compatibility */
  showIyzico?: boolean;
  /** @deprecated use href */
  iyzicoHref?: string;
  gap?: number;
};

const BAND_SRC = "/images/payment/iyzico-cards-band.png";
const BAND_ALT = "iyzico ile Öde — Mastercard, Visa, American Express, Troy";

const CSS = `
  .yp-pay-band img {
    height: 22px;
    width: auto;
    max-width: min(220px, 72vw);
    display: block;
    border-radius: 4px;
  }
  @media (min-width: 768px) {
    .yp-pay-band img {
      height: var(--yp-pay-band-h, 32px);
      max-width: 100%;
      border-radius: 6px;
    }
  }
`;

/** Official iyzico payment marks band (iyzico + Mastercard + Visa + Amex + Troy). */
export default function PaymentCardLogos({
  height = 32,
  className,
  href,
  iyzicoHref,
}: Props) {
  const link = href || iyzicoHref;
  const img = (
    <img
      src={BAND_SRC}
      alt={BAND_ALT}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <>
      <style>{CSS}</style>
      <div
        className={["yp-pay-band", className].filter(Boolean).join(" ")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
          ["--yp-pay-band-h" as string]: `${height}px`,
        }}
      >
        {link ? (
          <a href={link} aria-label={BAND_ALT} style={{ lineHeight: 0 }}>
            {img}
          </a>
        ) : (
          img
        )}
      </div>
    </>
  );
}
