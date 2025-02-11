'use client';
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const shippingCosts = {
  jewelry: {
    name: 'Jewelry',
    cost: null,
    subcategories: {
      chain: { name: 'Chain', cost: 750 },
      ring: { name: 'Ring', cost: 800 },
      bracelet: { name: 'Bracelet', cost: 700 },
      necklace: { name: 'Necklace', cost: 850 },
    },
  },
  electronics: {
    name: 'Electronics',
    cost: null,
    subcategories: {
      smartphone: { name: 'Smartphone', cost: 500 },
      laptop: { name: 'Laptop', cost: 1000 },
    },
  },
};
export default function RightSidebarPage() {
  const [expandedCategories, setExpandedCategories] =
    useState<ExpandedCategories>({});

  interface SubCategory {
    name: string;
    cost: number;
  }

  // eslint-disable-next-line no-unused-vars
  interface Category {
    name: string;
    cost: null;
    subcategories: Record<string, SubCategory>;
  }

  interface ExpandedCategories {
    [key: string]: boolean;
  }

  const toggleCategory = (category: string): void => {
    setExpandedCategories((prev: ExpandedCategories) => ({
      [category]: !prev[category],
    }));
  };
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="custom-scrollbar sticky right-0 top-0 flex h-full w-64 flex-col border-l border-custom-gray/20 bg-white px-6 pt-28 max-md:hidden"
    >
      <div className="flex flex-1 flex-col gap-2 py-4 pb-8">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-lg font-bold"
        >
          Shipping Costs
        </motion.h2>

        {Object.entries(shippingCosts).map(([categoryKey, category]) => (
          <motion.div
            key={categoryKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="border-b border-custom-gray/20 pb-2"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCategory(categoryKey)}
              className={`flex w-full items-center justify-between py-2 text-sm font-medium transition-colors duration-200 ${
                expandedCategories[categoryKey]
                  ? 'text-bondi-blue-500'
                  : 'text-gray-700 hover:text-bondi-blue-400'
              }`}
            >
              <span>{category.name}</span>
              <motion.div
                animate={{ rotate: expandedCategories[categoryKey] ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight
                  className={`size-4 ${
                    expandedCategories[categoryKey]
                      ? 'text-bondi-blue-500'
                      : 'text-gray-700'
                  }`}
                />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedCategories[categoryKey] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 flex flex-col gap-2 overflow-hidden"
                >
                  {Object.entries(category.subcategories).map(
                    ([subKey, subCategory], index) => (
                      <motion.div
                        key={subKey}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between py-1 text-sm text-gray-600"
                      >
                        <span>{subCategory.name}</span>
                        <span className="font-medium">
                          {subCategory.cost} Taka/KG
                        </span>
                      </motion.div>
                    ),
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
}
