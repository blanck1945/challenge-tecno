import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className="no-underline text-black text-[#ffffff] bg-[#c1292e] rounded-md p-3 transition-colors"
    >
      <span className="flex gap-5 ">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
