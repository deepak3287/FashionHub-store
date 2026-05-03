import Link from "next/link";

export default function PaymentSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <main className="premium-container py-16">
      <div className="premium-card mx-auto max-w-xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
        <h1 className="mt-6 text-3xl font-black">Payment successful</h1>
        <p className="mt-3 text-black/60">
          Your FashionHub order has been placed after prepaid confirmation.
        </p>
        {searchParams.order && <p className="mt-3 font-bold">Order: {searchParams.order}</p>}
        <Link href="/my-orders" className="btn-primary mt-6">View My Orders</Link>
      </div>
    </main>
  );
}
