import { HomePage } from '@/components/HomePage';
import testsData from '@/data/tests.json';
import categoriesData from '@/data/categories.json';
import { Test, Category } from '@/types/test';

export default function Home() {
  const tests = testsData.tests as Test[];
  const categories = categoriesData.categories as Category[];

  return <HomePage tests={tests} categories={categories} />;
}
