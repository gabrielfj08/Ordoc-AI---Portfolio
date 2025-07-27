export interface AccordionItem {
  label: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: Array<AccordionItem>;
  defaultOpen: boolean;
}
