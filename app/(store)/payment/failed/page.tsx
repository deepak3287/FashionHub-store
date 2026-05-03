import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="premium-container py-16">
      <div className="premium-card mx-auto max-w-xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">!</div>
        <h1 className="mt-6 text-3xl font-black">Payment failed</h1>
        <p className="mt-3 text-black/60">No order was confirmed. Please retry your prepaid payment.</p>
        <Link href="/checkout" className="btn-primary mt-6">Retry Payment</Link>
      </div>
    </main>
  );
}
