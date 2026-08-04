"use client";

type RequestFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

const options = [
  {
    label: "Semua Status",
    value: "all",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Submitted",
    value: "submitted",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

export default function RequestFilter({
  value,
  onChange,
}: RequestFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}