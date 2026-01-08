import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQAccordion() {
  const faqs = [
    {
      q: "Is this tool completely free to use?",
      a: "Yes! Our YouTube Playlist Downloader is 100% free. We don't require any registration, credit cards, or hidden fees. Enjoy unlimited simulations."
    },
    {
      q: "Are there any limits on the number of videos?",
      a: "No hard limits. However, for very large playlists (100+ videos), browser performance might slow down since everything is processed client-side in this demo."
    },
    {
      q: "Does it work on mobile devices?",
      a: "Absolutely. Our design is fully responsive and optimized for mobile phones, tablets, and desktops. You can manage your playlists from anywhere."
    },
    {
      q: "Is it legal to download YouTube videos?",
      a: "You should only download videos that you have permission to use or that fall under fair use policies. This tool simulates the download process for educational and testing purposes."
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b-border/50">
          <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4 text-lg">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
