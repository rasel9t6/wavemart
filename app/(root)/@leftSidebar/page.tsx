import SidebarContent from '@/components/SidebarContent';
import { getCategories } from '@/lib/actions';

export default async function LeftSidebarPage() {
  const categories = await getCategories();
  
  return (
    <aside className="custom-scrollbar sticky top-0 h-screen w-64 border-r border-custom-gray/20 bg-white pr-6 pt-28 max-md:hidden">
      <SidebarContent categories={categories} />
    </aside>
  );
}
