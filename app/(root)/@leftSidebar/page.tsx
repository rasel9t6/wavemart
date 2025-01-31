import SidebarContent from '@/components/SidebarContent';
import { getCollections } from '@/lib/actions';

export default async function LeftSidebarPage() {
  const collections = await getCollections();
  return (
    <aside className="custom-scrollbar sticky left-0 top-0 flex h-screen w-64 min-w-[250px] flex-col justify-between overflow-y-auto border-r border-custom-gray/20 p-5 pt-36 max-sm:hidden lg:w-[268px]">
      <SidebarContent collections={collections} />
    </aside>
  );
}
