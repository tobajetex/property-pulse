"use client";

import Link from "next/link";

export default function TestNavLink() {
  return (
    <Link
      href="/test"
      className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
    >
      🧪 Test
    </Link>
  );
}
