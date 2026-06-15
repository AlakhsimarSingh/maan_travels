"use client";

export default function CalculatorResult({
  amount,
  vehicleName,
  service,
  distance,
  days,
}: any) {
  const sendWhatsApp = () => {
    const message = `
Hello Maan Travels,

I need:
${vehicleName || "Vehicle not selected"}

Service:
${service}

${service === "taxi" ? `Distance: ${distance} km` : `Days: ${days}`}

Estimated Cost:
₹${amount}

Please confirm availability.
    `;

    const url = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="mt-10 rounded-2xl border border-[#252525] bg-black/40 p-6 text-center">
      <p className="text-[#8a8a8a]">Estimated Fare</p>

      <h3 className="mt-2 text-3xl font-bold text-white">
        ₹{amount}
      </h3>

      <button
        onClick={sendWhatsApp}
        className="mt-6 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-black"
      >
        Send WhatsApp Quote
      </button>
    </div>
  );
}