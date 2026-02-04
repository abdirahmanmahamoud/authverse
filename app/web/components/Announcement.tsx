import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Badge } from "./ui/badge";

const Announcement = () => {
  return (
    <Badge asChild variant="secondary" className="bg-transparent">
      <Link href="/docs/changelog">
        <span className="flex size-2 rounded-full bg-blue-500" title="New" />
        New version of Authverse! <ArrowRightIcon />
      </Link>
    </Badge>
  );
};

export default Announcement;
