"use client";

import { useState } from "react";
import { Building2, CreditCard, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
type Frequency = "one-time" | "annually";
type Currency = "USD" | "RWF";

export default function DonationForm() {
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [donor, setDonor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    homeAddress: "",
    message: "",
  });

  const updateDonor = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setDonor((current) => ({ ...current, [name]: value }));
  };

  const  handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (!amount || !donor.firstName || !donor.lastName || !donor.email|| !donor.phoneNumber || !donor.email ) {
      toast.error("Please fill in all required fields.")
      return
    }
    data.append("amount", amount)
    data.append("frequency", frequency)
    data.append("currency", currency)
    data.append("firstName", donor.firstName)
    data.append("lastName", donor.lastName)
    data.append("email", donor.email)
    data.append("phoneNumber", donor.phoneNumber)
    data.append("homeAddress", donor.homeAddress)
    data.append("message", donor.message)
    console.log({FormData})

    setIsLoading(true)
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Failed to process donation")
        toast.error("An error occurred while processing your donation. Please try again.")
      }
      if (response.ok) {
        const result = await response.json()
        setInvoiceNumber(result.invoiceNumber)
        toast.success("Donation processed successfully!")
        window.location.href = result.paymentLinkUrl
      }

    } catch (error) {
      toast.error("An error occurred while processing your donation. Please try again.")
    } finally {
      setIsLoading(false)
    }

  }



  return (
    <section id="donation-form" className="bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[440px] px-4 sm:px-0">
        <form onSubmit={handleSubmit} className="space-y-4 text-[#003D5C]">
          <div>
            <label
              htmlFor="currency"
              className="mb-1.5 block text-[13px] font-medium"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as Currency)
              }
              className="h-9 w-full rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 text-xs outline-none focus:ring-2 focus:ring-[#0099CC]/30"
            >
              <option value="USD">US Dollar</option>
              <option value="RWF">Rwandan Franc</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="donation-amount"
              className="mb-1.5 block text-[13px] font-medium"
            >
              Donation Amount
            </label>
            <div className="flex h-11 items-center rounded-[3px] border border-[#9fc3ff] bg-[#eff5fc] px-3 focus-within:ring-2 focus-within:ring-[#0099CC]/30">
              <span className="mr-2 text-xl leading-none">{currency === "USD" ? "$" : "RWF"}</span>
              <input
                id="donation-amount"
                type="number"
                min="1"
                value={amount}
                required
                placeholder="Enter amount"
                onChange={(event) => setAmount(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base text-[#8090a6] outline-none"
                aria-label="Donation amount in US dollars"
              />
              <span className="text-xs font-medium">{currency}</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="donation-frequency"
              className="mb-1.5 block text-[13px] font-medium"
            >
              Frequency
            </label>
            <select
              id="donation-frequency"
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value as Frequency)
              }
              className="h-9 w-full rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 text-xs outline-none focus:ring-2 focus:ring-[#0099CC]/30"
            >
              <option value="one-time">One time donation</option>
              <option value="annually">Annually donation</option>
            </select>
          </div>

          {
            <Field
              label="Mobile phone number"
              name="phoneNumber"
              placeholder="+250 788 123 456"
              value={donor.phoneNumber}
              onChange={updateDonor}
            />
          }
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="First Name"
              name="firstName"
              placeholder="First"
              value={donor.firstName}
              onChange={updateDonor}
              required
            />
            <Field
              label="Last Name"
              name="lastName"
              placeholder="Last"
              value={donor.lastName}
              onChange={updateDonor}
              required
            />
          </div>
          <Field
            label="Email Address"
            name="email"
            type="email"
            placeholder="Email"
            value={donor.email}
            onChange={updateDonor}
            required
          />
          <Field
            label="Home Address"
            name="homeAddress"
            placeholder="Home Address"
            value={donor.homeAddress}
            onChange={updateDonor}
          />
          <div>
            <label
              htmlFor="donation-message"
              className="mb-1.5 block text-[13px]"
            >
              Message for children (optional)
            </label>
            <textarea
              id="donation-message"
              name="message"
              value={donor.message}
              onChange={updateDonor}
              placeholder="Message"
              rows={3}
              className="w-full resize-y rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 py-2 text-xs outline-none placeholder:text-[#aeb9c8] focus:ring-2 focus:ring-[#0099CC]/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-10 w-full rounded-[4px] bg-[#176ff0] text-base font-bold text-white transition hover:bg-[#0958ce] disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading
              ? "Preparing secure checkout..."
              : `Donate ${frequency === "annually" ? "Annually" : "One time"}`}
          </button>
          {invoiceNumber && (
            <p className="text-center text-xs text-[#1B7063]">
              Checkout opened securely.{" "}
              <button
                type="button"
                className="font-semibold underline"
              >
                Open again
              </button>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`donation-${name}`} className="mb-1.5 block text-[13px]">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={`donation-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-9 w-full rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 text-xs outline-none placeholder:text-[#aeb9c8] focus:ring-2 focus:ring-[#0099CC]/30"
      />
    </div>
  );
}
