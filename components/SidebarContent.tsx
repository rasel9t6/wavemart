'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SidebarContent({ categories }: { categories: any[] }) {
  const pathname = usePathname();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredCategory(id);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex size-full flex-col gap-1 p-2"
    >
      {categories.map((category) => {
        const isExpanded = hoveredCategory === category._id;
        const isActive = pathname.includes(`/categories/${category.slug}`);

        return (
          <div
            key={category._id}
            className="flex flex-col"
            onMouseEnter={() => handleMouseEnter(category._id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link href={`/categories/${category.slug}`} className="w-full">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center gap-2 rounded-lg p-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 ${
                  isActive ? 'bg-gray-50 text-bondi-blue' : 'text-gray-700'
                }`}
              >
                <span className="flex flex-1 items-center gap-2">
                  {category.icon && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={20}
                        height={20}
                        className=""
                      />
                    </motion.div>
                  )}
                  <span>{category.name}</span>
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="size-4 text-gray-400" />
                </motion.div>
              </motion.button>
            </Link>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    transition: {
                      height: {
                        duration: 0.2,
                        ease: 'easeOut',
                      },
                      opacity: {
                        duration: 0.15,
                        delay: 0.05,
                      },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                      height: {
                        duration: 0.15,
                      },
                      opacity: {
                        duration: 0.1,
                      },
                    },
                  }}
                  className="ml-4 mt-1 flex flex-col gap-1 overflow-hidden border-l border-gray-200 pl-2"
                >
                  {category.subcategories.map(
                    (subcategory: any, index: number) => {
                      const isSubcategoryActive =
                        pathname ===
                        `/categories/${category.slug}/${subcategory.slug}`;

                      return (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: index * 0.03, // Faster stagger for hover
                            },
                          }}
                          key={subcategory._id}
                        >
                          <Link
                            href={`/categories/${category.slug}/${subcategory.slug}`}
                            className={`group flex items-center gap-2 rounded-lg p-2 text-sm transition-all duration-200 hover:bg-gray-100 ${
                              isSubcategoryActive
                                ? 'bg-gray-50 font-medium text-bondi-blue'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {subcategory.icon && (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 10,
                                }}
                              >
                                <Image
                                  src={subcategory.icon}
                                  alt={subcategory.name}
                                  width={16}
                                  height={16}
                                  className="opacity-75 group-hover:opacity-100"
                                />
                              </motion.div>
                            )}
                            <span>{subcategory.name}</span>
                          </Link>
                        </motion.div>
                      );
                    },
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.nav>
  );
}
