/**
 * MDX globals registry — components available inside MDX without `import`.
 * Wired via `<Content components={components} />` in `[...slug].astro`.
 * Add new components here as you build (or install) them.
 */

import {
  Accordion,
  AccordionContent,
  AccordionGroup,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Aside } from "./components/ui/aside";
import Render from "./components/Render.astro";
import { Card } from "./components/ui/card";
import { CardGrid } from "./components/ui/card-grid";
import { Embed } from "./components/ui/embed";
import { FileTree } from "./components/ui/file-tree";
import { Frame } from "./components/ui/frame";
import { LinkCard } from "./components/ui/link-card";
import { PackageManagers } from "./components/ui/package-managers";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Step, Steps } from "./components/ui/steps";
import { Tabs, TabItem } from "./components/ui/tabs";
import { VersionSwitcher } from "./components/ui/version-switcher";

export const components = {
  Accordion,
  AccordionContent,
  AccordionGroup,
  AccordionTrigger,
  Aside,
  Card,
  CardGrid,
  Embed,
  FileTree,
  Frame,
  LinkCard,
  PackageManagers,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Render,
  Step,
  Steps,
  TabItem,
  Tabs,
  VersionSwitcher,
};
