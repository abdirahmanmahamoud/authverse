import { source } from "@/lib/source";
import { findNeighbour } from "fumadocs-core/page-tree";
import { notFound } from "next/navigation";
import z from "zod";
import fm from "front-matter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import mdxComponents from "@/components/mdxComponents";
import DocsTableOfContents from "@/components/DocsTableOfContents";

const DocsPage = async (props: { params: Promise<{ slug: string[] }> }) => {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const doc = page.data;
  const MDX = doc.body;
  const neighbours = findNeighbour(source.pageTree, page.url);

  const raw = await page.data.getText("raw");
  const { attributes } = fm(raw);
  const { links } = z
    .object({
      links: z
        .object({
          doc: z.string().optional(),
          api: z.string().optional(),
        })
        .optional(),
    })
    .parse(attributes);

  return (
    <div className="px-[4%] mt-10 pb-5 flex flex-col lg:flex-row">
      <div className="w-full lg:w-[75%]">
        <h1 className="text-3xl font-bold">{doc.title}</h1>
        {doc.description && (
          <p className="text-fd-muted-foreground">{doc.description}</p>
        )}
        <div className="mt-5">
          <MDX components={mdxComponents} />
        </div>
        <div className="py-6 flex justify-between items-center">
          {neighbours.previous ? (
            <Button variant="secondary" size="sm" asChild>
              <Link href={neighbours.previous.url}>
                <IconArrowLeft /> {neighbours.previous.name}
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
          {neighbours.next && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <IconArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="w-[25%] lg:pl-3 pt-5 lg:pt-0 hidden lg:block fixed ml-[55%]">
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DocsPage;
